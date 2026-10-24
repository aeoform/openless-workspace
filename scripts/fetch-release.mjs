#!/usr/bin/env node
/**
 * Snapshots the latest stable GitHub release into public/release.json so the
 * static site can link directly to the right installer without calling the
 * GitHub API from the browser (rate limits, CORS, no runtime server).
 *
 * Runs as `prebuild`, and on a schedule from GitHub Actions. A failed fetch
 * keeps the committed snapshot and never fails the build.
 */
import { writeFile, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = process.env.RELEASE_REPO ?? "Open-Less/openless";
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../public/release.json");

/** Map release asset filenames onto the slots the site links to. */
const MATCHERS = [
  ["macosArm", /_aarch64\.dmg$/i],
  ["macosIntel", /_x64\.dmg$/i],
  ["windowsX64", /_x64-setup\.exe$/i],
  ["windowsMSI", /_x64_en-US\.msi$/i],
  ["linuxDeb", /\.deb$/i],
  ["linuxRpm", /\.rpm$/i],
  // Longer ABIs first: x86_64 also matches /x86/, arm64 before armeabi.
  ["androidArm64", /_arm64-v8a\.apk$/i],
  ["androidArmv7", /_armeabi-v7a\.apk$/i],
  ["androidX86_64", /_x86_64\.apk$/i],
  ["androidX86", /_x86\.apk$/i],
  ["checksums", /^SHA256SUMS$/i],
];

function classify(name) {
  for (const [slot, pattern] of MATCHERS) {
    if (pattern.test(name)) return slot;
  }
  return null;
}

function cleanVersion(tag) {
  return tag
    .replace(/^v/i, "")
    .replace(/-(tauri|beta|beta\.\d+)$/i, "")
    .replace(/-Beta\.\d+.*$/i, "");
}

async function github(path) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "openless-website-release-sync",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const response = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    headers,
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`GitHub API ${response.status} for ${path}`);
  return response.json();
}

async function latestStable() {
  const releases = await github("/releases?per_page=10");
  const stable = releases.find((release) => !release.draft && !release.prerelease);
  if (stable) return stable;
  return github("/releases/latest");
}

async function existing() {
  try {
    return JSON.parse(await readFile(OUT, "utf8"));
  } catch {
    return null;
  }
}

async function main() {
  let release;
  try {
    release = await latestStable();
  } catch (error) {
    const previous = await existing();
    console.warn(`[release] GitHub lookup failed (${error.message}); keeping ${previous ? `snapshot ${previous.tag}` : "no snapshot"}.`);
    if (previous) return;
    // No snapshot and no network: ship a minimal fallback so the UI still works.
    await writeFile(
      OUT,
      JSON.stringify(
        {
          repo: REPO,
          tag: null,
          version: null,
          publishedAt: null,
          htmlUrl: `https://github.com/${REPO}/releases/latest`,
          fetchedAt: new Date().toISOString(),
          source: "fallback",
          assets: {},
        },
        null,
        2,
      ) + "\n",
    );
    return;
  }

  const assets = {};
  for (const asset of release.assets ?? []) {
    const slot = classify(asset.name);
    if (slot && !assets[slot]) {
      assets[slot] = { name: asset.name, url: asset.browser_download_url, size: asset.size };
    }
  }

  const payload = {
    repo: REPO,
    tag: release.tag_name,
    version: cleanVersion(release.tag_name),
    publishedAt: release.published_at,
    htmlUrl: release.html_url,
    fetchedAt: new Date().toISOString(),
    source: "github-api",
    assets,
  };

  await writeFile(OUT, JSON.stringify(payload, null, 2) + "\n");
  console.log(`[release] ${payload.tag} with ${Object.keys(assets).length} installer(s) → public/release.json`);
}

await main();
