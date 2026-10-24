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

let snapshot: ReleaseInfo | null = staticRelease;
let started = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

/** Loaded once per session, shared by every consumer. */
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
      // Offline or blocked: keep the static fallback links.
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

export type Platform = "macos" | "windows" | "linux" | "other";
export type Arch = "arm64" | "x64" | "unknown";

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

/** Stable string key so useSyncExternalStore does not see a new object each render. */
function detectKey(): string {
  const platform = detectPlatform();
  return `${platform}:${detectArch(platform)}`;
}

const serverKey = () => "other:unknown";

export type DownloadTarget = {
  id: AssetSlot;
  /** Platform label shown in the UI. */
  label: string;
  short: string;
  href: string;
  direct: boolean;
  recommended: boolean;
};

export type DownloadTargets = {
  version: string | null;
  tag: string | null;
  publishedAt: string | null;
  detected: Platform;
  /** Direct installer for the detected platform, or null when we cannot tell. */
  primary: DownloadTarget | null;
  targets: DownloadTarget[];
  /** GitHub releases page, used for "all versions" and as a safe fallback. */
  href: string;
  checksums: DownloadTarget | null;
};

const RELEASES_PAGE = "https://github.com/Open-Less/openless/releases/latest";

function assetUrl(release: ReleaseInfo | null, slot: AssetSlot): { href: string; direct: boolean } {
  const asset = release?.assets?.[slot];
  if (asset?.url) return { href: asset.url, direct: true };
  return { href: release?.htmlUrl ?? RELEASES_PAGE, direct: false };
}

function buildTarget(release: ReleaseInfo | null, slot: AssetSlot, label: string, short: string): DownloadTarget {
  const { href, direct } = assetUrl(release, slot);
  return { id: slot, label, short, href, direct, recommended: false };
}

export function useDownloadTargets(): DownloadTargets {
  const release = useLatestRelease();
  const key = useSyncExternalStore(noopSubscribe, detectKey, serverKey);
  const [detected, arch] = key.split(":") as [Platform, Arch];

  const macosArm = buildTarget(release, "macosArm", "macOS · Apple Silicon", "macOS");
  const macosIntel = buildTarget(release, "macosIntel", "macOS · Intel", "macOS");
  const windows = buildTarget(release, "windowsX64", "Windows x64", "Windows");
  const linux = buildTarget(release, "linuxDeb", "Linux · deb", "Linux");
  const linuxRpm = buildTarget(release, "linuxRpm", "Linux · rpm", "Linux");
  const checksums = buildTarget(release, "checksums", "SHA256SUMS", "SHA256SUMS");

  const recommendedSlot: AssetSlot | null =
    detected === "macos"
      ? arch === "x64"
        ? "macosIntel"
        : "macosArm"
      : detected === "windows"
        ? "windowsX64"
        : detected === "linux"
          ? "linuxDeb"
          : null;

  const candidates = [macosArm, macosIntel, windows, linux];
  // Only offer rpm when the release actually ships one.
  if (linuxRpm.direct) candidates.push(linuxRpm);

  const targets = candidates.map((target) => ({ ...target, recommended: target.id === recommendedSlot }));
  const primary = targets.find((target) => target.recommended) ?? null;
  const href = release?.htmlUrl ?? RELEASES_PAGE;

  return {
    version: release?.version ?? null,
    tag: release?.tag ?? null,
    publishedAt: release?.publishedAt ?? null,
    detected,
    primary,
    targets,
    href,
    checksums: checksums.direct ? checksums : null,
  };
}

export { RELEASES_PAGE };
