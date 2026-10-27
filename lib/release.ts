import { useEffect, useState, useSyncExternalStore } from "react";
import { staticRelease } from "@/lib/release-static";

export type AssetSlot =
  | "macosArm"
  | "macosIntel"
  | "windowsX64"
  | "windowsMSI"
  | "linuxDeb"
  | "linuxRpm"
  | "androidArm64"
  | "androidArmv7"
  | "androidX86_64"
  | "androidX86"
  | "harmonyArm"
  | "harmony"
  | "checksums";

export type ReleaseAsset = { name: string; url: string; size: number };

/** One channel (stable or pre-release) of the upstream repository. */
export type ReleaseChannel = {
  tag: string | null;
  version: string | null;
  publishedAt: string | null;
  htmlUrl: string;
  assets: Partial<Record<AssetSlot, ReleaseAsset>>;
};

export type ReleaseInfo = ReleaseChannel & {
  repo: string;
  fetchedAt: string;
  source: "github-api" | "fallback";
  beta: ReleaseChannel | null;
};

export type Platform = "macos" | "windows" | "linux" | "other";
export type Arch = "arm64" | "x64" | "unknown";

export type Group = "macos" | "windows" | "linux" | "android" | "harmony";

export type PlatformOption = {
  key: string;
  os: string;
  arch: string;
  group: Group;
  /** Direct release-asset URL; null when this release has no package for the slot. */
  href: string | null;
  size: number | null;
  recommended: boolean;
};

let snapshot: ReleaseInfo | null = staticRelease;
let started = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

/** Refreshed once per session; the build-time snapshot already renders in HTML. */
function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  fetch("/release.json", { cache: "no-cache" })
    .then((response) => (response.ok ? response.json() : null))
    .then((data: ReleaseInfo | null) => {
      if (!data || typeof data !== "object") return;
      if (JSON.stringify(data) === JSON.stringify(snapshot)) return;
      snapshot = data;
      emit();
    })
    .catch(() => {
      // Offline or blocked: keep the build-time snapshot.
    });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  start();
  return () => listeners.delete(listener);
}

const getSnapshot = () => snapshot;
/** Server render and hydration both use the build-time snapshot, so markup matches. */
const getServerSnapshot = () => staticRelease;

export function useLatestRelease(): ReleaseInfo | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const noopSubscribe = () => () => {};

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  // userAgentData.platform is the most reliable signal where it exists.
  const hinted = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ?? "";
  const legacy = navigator.platform ?? "";
  const ua = `${hinted} ${legacy} ${navigator.userAgent}`;

  if (/android|iphone|ipad|ipod/i.test(ua)) return "other";
  if (/mac os x|macintosh|macintel|macppc|mac68k/i.test(ua)) return "macos";
  if (/windows|win32|win64|winnt/i.test(ua)) return "windows";
  if (/linux|x11|cros|ubuntu|fedora|debian/i.test(ua)) return "linux";
  return "other";
}

function detectArch(platform: Platform): Arch {
  if (typeof navigator === "undefined") return "unknown";
  const hinted = (navigator as Navigator & { userAgentData?: { architecture?: string } }).userAgentData?.architecture;
  if (hinted === "arm") return "arm64";
  if (hinted === "x86") return "x64";
  const ua = navigator.userAgent;
  if (/arm64|aarch64/i.test(ua)) return "arm64";
  if (platform === "macos") return "unknown"; // Safari and Firefox expose no arch
  return "x64";
}

/** Stable string key so useSyncExternalStore does not see a new value each render. */
function detectKey(): string {
  const platform = detectPlatform();
  return `${platform}:${detectArch(platform)}`;
}

const serverKey = () => "other:unknown";

export const RELEASES_PAGE = "https://github.com/Open-Less/openless/releases";
export const LATEST_RELEASE = "https://github.com/Open-Less/openless/releases/latest";

/**
 * Optional mirror base (e.g. https://dl.aeoform.com). When set at build time,
 * downloads come from our own OSS-backed origin behind ESA instead of GitHub.
 */
const DL_BASE = (() => {
  const configured = process.env.NEXT_PUBLIC_DL_BASE?.trim();
  // Default to the mirror so a deployment that forgets the env var still gets
  // fast downloads; "none" is the explicit opt-out.
  if (!configured) return "https://dl.aeoform.com";
  if (/^(none|off|0|false)$/i.test(configured)) return "";
  return configured.replace(/\/$/, "");
})();

export function assetUrl(name: string, tag?: string | null, mirror = Boolean(DL_BASE)): string {
  if (mirror && DL_BASE && tag) {
    return `${DL_BASE}/releases/${encodeURIComponent(tag)}/${encodeURIComponent(name)}`;
  }
  // GitHub fallback must stay tag-pinned: the `latest` alias only carries the
  // newest *stable* assets, so a beta-only file (Linux deb/rpm) 404s there.
  if (tag) {
    return `https://github.com/Open-Less/openless/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(name)}`;
  }
  return `${LATEST_RELEASE}/download/${encodeURIComponent(name)}`;
}

function option(
  release: ReleaseInfo | null,
  slot: AssetSlot,
  key: string,
  os: string,
  arch: string,
  group: Group,
  mirror: boolean,
): PlatformOption {
  const asset = release?.assets?.[slot];
  // `tag` is only honoured when the mirror answered; otherwise the GitHub alias
  // is used, so a mirror outage degrades instead of breaking downloads.
  return {
    key,
    os,
    arch,
    group,
    href: asset ? assetUrl(asset.name, release?.tag, mirror) : null,
    size: asset?.size ?? null,
    recommended: false,
  };
}

/**
 * Probes the mirror once per release. Downloads prefer it (Aliyun edge + ECS
 * cache); on failure everything silently falls back to GitHub's latest alias.
 */
export function useMirrorHealth(tag: string | null): boolean {
  const [ok, setOk] = useState(Boolean(DL_BASE));
  useEffect(() => {
    if (!DL_BASE) return;
    let cancelled = false;
    const url = tag
      ? `${DL_BASE}/releases/${encodeURIComponent(tag)}/SHA256SUMS`
      : `${DL_BASE}/healthz`;
    const timeout = AbortSignal.timeout?.(4000);
    fetch(url, { method: "HEAD", ...(timeout ? { signal: timeout } : {}) })
      .then((response) => {
        if (!cancelled) setOk(response.ok);
      })
      .catch(() => {
        if (!cancelled) setOk(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tag]);
  return ok;
}

/**
 * HarmonyOS has only shipped as a sideloadable .hap in pre-releases so far, and
 * both an arm64 and a universal build exist; prefer the arm64 one.
 */
function harmonyOption(release: ReleaseInfo | null, mirror: boolean): PlatformOption {
  const asset = release?.assets?.harmonyArm ?? release?.assets?.harmony;
  return {
    key: "harmony",
    os: "HarmonyOS",
    arch: asset?.name.includes("arm64") ? "arm64 · .hap" : "universal · .hap",
    group: "harmony",
    href: asset ? assetUrl(asset.name, release?.tag, mirror) : null,
    size: asset?.size ?? null,
    recommended: false,
  };
}

/** Used when the UA gives no architecture, or reports one we did not anticipate. */
const PLATFORM_DEFAULT: Record<Platform, AssetSlot> = {
  macos: "macosArm",
  windows: "windowsX64",
  linux: "linuxDeb",
  other: "macosArm",
};

const SLOT_RECOMMENDATION: Record<string, AssetSlot> = {
  "macos:arm64": "macosArm",
  "macos:x64": "macosIntel",
  "macos:unknown": "macosArm",
  "windows:x64": "windowsX64",
  "windows:unknown": "windowsX64",
  "linux:x64": "linuxDeb",
  "linux:arm64": "linuxDeb",
  "linux:unknown": "linuxDeb",
  "other:x64": "macosArm",
  "other:arm64": "macosArm",
  "other:unknown": "macosArm",
};

export type DownloadState = {
  detected: Platform;
  /** Options missing from the stable channel but present in the pre-release. */
  betaOptions: PlatformOption[];
  betaVersion: string | null;
  betaPublishedAt: string | null;
  options: PlatformOption[];
  recommended: PlatformOption | null;
  version: string | null;
  publishedAt: string | null;
  /** Whether the mirror answered; when false all hrefs are GitHub links. */
  mirror: boolean;
  releasesHref: string;
  checksumsHref: string | null;
};

export function useDownloadState(): DownloadState {
  const release = useLatestRelease();
  const mirror = useMirrorHealth(release?.tag ?? null);
  const key = useSyncExternalStore(noopSubscribe, detectKey, serverKey);
  const [detected, arch] = key.split(":") as [Platform, Arch];

  const all: PlatformOption[] = [
    option(release, "macosArm", "mac-arm", "macOS", "Apple Silicon", "macos", mirror),
    option(release, "macosIntel", "mac-intel", "macOS", "Intel", "macos", mirror),
    option(release, "windowsX64", "win-setup", "Windows", "x64 setup.exe", "windows", mirror),
    option(release, "windowsMSI", "win-msi", "Windows", "x64 MSI", "windows", mirror),
    option(release, "linuxDeb", "linux-deb", "Linux", "deb", "linux", mirror),
    option(release, "linuxRpm", "linux-rpm", "Linux", "rpm", "linux", mirror),
    option(release, "androidArm64", "android-arm64", "Android", "arm64-v8a APK", "android", mirror),
    option(release, "androidArmv7", "android-armv7", "Android", "armeabi-v7a APK", "android", mirror),
    option(release, "androidX86_64", "android-x86_64", "Android", "x86_64 APK", "android", mirror),
    option(release, "androidX86", "android-x86", "Android", "x86 APK", "android", mirror),
    harmonyOption(release, mirror),
  ];

  // The stable channel has lagged on Linux before, so surface anything the
  // pre-release ships for a platform the stable channel cannot serve.
  const betaAssets = release?.beta?.assets ?? {};
  const betaTag = release?.beta?.tag ?? null;
  const BETA_SLOTS: [AssetSlot, string, string, string, Group][] = [
    ["macosArm", "mac-arm-beta", "macOS", "Apple Silicon", "macos"],
    ["macosIntel", "mac-intel-beta", "macOS", "Intel", "macos"],
    ["windowsX64", "win-setup-beta", "Windows", "x64 setup.exe", "windows"],
    ["windowsMSI", "win-msi-beta", "Windows", "x64 MSI", "windows"],
    ["linuxDeb", "linux-deb-beta", "Linux", "deb", "linux"],
    ["linuxRpm", "linux-rpm-beta", "Linux", "rpm", "linux"],
    ["androidArm64", "android-arm64-beta", "Android", "arm64-v8a APK", "android"],
    ["androidArmv7", "android-armv7-beta", "Android", "armeabi-v7a APK", "android"],
    ["androidX86_64", "android-x86_64-beta", "Android", "x86_64 APK", "android"],
    ["androidX86", "android-x86-beta", "Android", "x86 APK", "android"],
  ];
  const stableHrefs = new Map<string, boolean>();
  for (const entry of all) {
    if (entry.href) stableHrefs.set(entry.group, true);
  }
  const betaHarmony = betaAssets.harmonyArm ?? betaAssets.harmony;
  const betaOptions: PlatformOption[] = BETA_SLOTS.flatMap(([slot, key, os, arch, group]) => {
    if (stableHrefs.get(group)) return [];
    const asset = betaAssets[slot];
    if (!asset) return [];
    return [
      {
        key,
        os,
        arch,
        group,
        href: assetUrl(asset.name, betaTag, mirror),
        size: asset.size ?? null,
        recommended: false,
      },
    ];
  });

  // HarmonyOS only exists as a pre-release .hap so far.
  if (!stableHrefs.get("harmony") && betaHarmony) {
    betaOptions.push({
      key: "harmony-beta",
      os: "HarmonyOS",
      arch: betaHarmony.name.includes("arm64") ? "arm64 · .hap" : "universal · .hap",
      group: "harmony",
      href: assetUrl(betaHarmony.name, betaTag, mirror),
      size: betaHarmony.size ?? null,
      recommended: false,
    });
  }

  // Only the primary installer of each platform is preselected, never the extras.
  const wanted = SLOT_RECOMMENDATION[`${detected}:${arch}`] ?? PLATFORM_DEFAULT[detected];
  const options = all.map((entry) => ({
    ...entry,
    recommended: entry.href !== null && matchesSlot(entry, wanted),
  }));
  options.sort((a, b) => Number(b.recommended) - Number(a.recommended));

  return {
    detected,
    betaOptions,
    betaVersion: release?.beta?.version ?? null,
    betaPublishedAt: release?.beta?.publishedAt ?? null,
    mirror,
    options,
    recommended: options.find((entry) => entry.recommended) ?? null,
    version: release?.version ?? null,
    publishedAt: release?.publishedAt ?? null,
    releasesHref: release?.htmlUrl ?? LATEST_RELEASE,
    checksumsHref: release?.assets?.checksums
      ? assetUrl(release.assets.checksums.name, release.tag, mirror)
      : null,
  };
}

function matchesSlot(entry: PlatformOption, slot: AssetSlot | undefined): boolean {
  if (!slot) return false;
  const map: Record<string, AssetSlot> = {
    "mac-arm": "macosArm",
    "mac-intel": "macosIntel",
    "win-setup": "windowsX64",
    "win-msi": "windowsMSI",
    "linux-deb": "linuxDeb",
    "linux-rpm": "linuxRpm",
    "android-arm64": "androidArm64",
    "android-armv7": "androidArmv7",
    "android-x86_64": "androidX86_64",
    "android-x86": "androidX86",
  };
  return map[entry.key] === slot;
}
