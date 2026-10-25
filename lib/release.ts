import { useSyncExternalStore } from "react";
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
  | "checksums";

export type ReleaseAsset = { name: string; url: string; size: number };

export type ReleaseInfo = {
  repo: string;
  tag: string | null;
  version: string | null;
  publishedAt: string | null;
  htmlUrl: string;
  fetchedAt: string;
  source: "github-api" | "fallback";
  assets: Partial<Record<AssetSlot, ReleaseAsset>>;
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
  const ua = navigator.userAgent;
  if (/android|iphone|ipad|ipod/i.test(ua)) return "other";
  if (/mac os x|macintosh/i.test(ua)) return "macos";
  if (/windows/i.test(ua)) return "windows";
  if (/linux|x11|cros/i.test(ua)) return "linux";
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

/** `latest/download/<file>` always resolves against the newest release. */
export function latestAssetUrl(name: string): string {
  return `${LATEST_RELEASE}/download/${encodeURIComponent(name)}`;
}

function option(
  release: ReleaseInfo | null,
  slot: AssetSlot,
  key: string,
  os: string,
  arch: string,
  group: Group,
): PlatformOption {
  const asset = release?.assets?.[slot];
  return {
    key,
    os,
    arch,
    group,
    href: asset ? latestAssetUrl(asset.name) : null,
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
  options: PlatformOption[];
  recommended: PlatformOption | null;
  version: string | null;
  publishedAt: string | null;
  releasesHref: string;
  checksumsHref: string | null;
};

export function useDownloadState(): DownloadState {
  const release = useLatestRelease();
  const key = useSyncExternalStore(noopSubscribe, detectKey, serverKey);
  const [detected, arch] = key.split(":") as [Platform, Arch];

  const all: PlatformOption[] = [
    option(release, "macosArm", "mac-arm", "macOS", "Apple Silicon", "macos"),
    option(release, "macosIntel", "mac-intel", "macOS", "Intel", "macos"),
    option(release, "windowsX64", "win-setup", "Windows", "x64 setup.exe", "windows"),
    option(release, "windowsMSI", "win-msi", "Windows", "x64 MSI", "windows"),
    option(release, "linuxDeb", "linux-deb", "Linux", "deb", "linux"),
    option(release, "linuxRpm", "linux-rpm", "Linux", "rpm", "linux"),
    option(release, "androidArm64", "android-arm64", "Android", "arm64-v8a APK", "android"),
    option(release, "androidArmv7", "android-armv7", "Android", "armeabi-v7a APK", "android"),
    option(release, "androidX86_64", "android-x86_64", "Android", "x86_64 APK", "android"),
    option(release, "androidX86", "android-x86", "Android", "x86 APK", "android"),
    {
      key: "harmony",
      os: "HarmonyOS",
      arch: "NEXT",
      group: "harmony",
      href: null,
      size: null,
      recommended: false,
    },
  ];

  // Only the primary installer of each platform is preselected, never the extras.
  const wanted = SLOT_RECOMMENDATION[`${detected}:${arch}`] ?? PLATFORM_DEFAULT[detected];
  const options = all.map((entry) => ({
    ...entry,
    recommended: entry.href !== null && matchesSlot(entry, wanted),
  }));
  options.sort((a, b) => Number(b.recommended) - Number(a.recommended));

  return {
    detected,
    options,
    recommended: options.find((entry) => entry.recommended) ?? null,
    version: release?.version ?? null,
    publishedAt: release?.publishedAt ?? null,
    releasesHref: release?.htmlUrl ?? LATEST_RELEASE,
    checksumsHref: release?.assets?.checksums?.url ?? null,
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
