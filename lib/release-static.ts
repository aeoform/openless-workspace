import releaseSnapshot from "@/public/release.json";
import type { ReleaseInfo } from "@/lib/release";

/**
 * Snapshot committed by `scripts/fetch-release.mjs` at build time. Importing it
 * lets the HTML ship with real installer links instead of an empty state; the
 * client store still refreshes from /release.json at runtime.
 */
export const staticRelease = releaseSnapshot as unknown as ReleaseInfo;
