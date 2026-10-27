#!/usr/bin/env node
/**
 * Snapshots the newest stable *and* pre-release GitHub releases into
 * public/release.json so the static site can link directly to the right
 * installer without calling the GitHub API from the browser (rate limits,
 * CORS, no runtime server).
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
  // HarmonyOS ships as a sideloadable .hap; arm64 build first.
  ["harmonyArm", /_harmony_arm64\.hap$/i],
  ["harmony", /_harmony\.hap$/i],
  ["checksums", /^SHA256SUMS$/i],
];

function classify(name) {
  for (const [slot, pattern] of MATCHERS) {
    if (pattern.test(name)) return slot;
  }
  return null;
}

/**
 * Releases ship both `OpenLess_2.0.1+build.20261016_aarch64.dmg` and a stable
 * `OpenLess_macos_aarch64.dmg` alias. Prefer the alias: it survives version
 * bumps and is what the mirror and the download page should point at.
 */
function score(name) {
  let value = 0;
  if (!/\+build\./i.test(name)) value += 2;
  if (/^OpenLess_(macos|windows|linux|android)_/i.test(name)) value += 2;
  value -= name.length / 1000;
  return value;
}

function cleanVersion(tag) {
  return tag
    .replace(/^v/i, "")
    .replace(/-tauri$/i, "")
    .replace(/\+build\..*$/i, "");
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

function pickAssets(release) {
  const candidates = new Map();
  for (const asset of release.assets ?? []) {
    const slot = classify(asset.name);
    if (!slot) continue;
    const current = candidates.get(slot);
    if (!current || score(asset.name) > score(current.name)) {
      candidates.set(slot, { name: asset.name, url: asset.browser_download_url, size: asset.size });
    }
  }
  return Object.fromEntries(candidates);
}

function describe(release) {
  return {
    tag: release.tag_name,
    version: cleanVersion(release.tag_name),
    name: release.name ?? release.tag_name,
    publishedAt: release.published_at,
    htmlUrl: release.html_url,
    prerelase: Boolean(release.prerelease),
    assets: pickAssets(release),
  };
}

async function fetchChannels() {
  const releases = await github("/releases?per_page=30");
  const published = releases.filter((release) => !release.draft);
  const stable = published.find((release) => !release.prerelease) ?? null;
  const beta =
    published.find((release) => release.prerelease && !/^v?1\./i.test(release.tag_name)) ?? null;
  return { stable, beta };
}

async function existing() {
  try {
    return JSON.parse(await readFile(OUT, "utf8"));
  } catch {
    return null;
  }
}

function fallback() {
  return {
    repo: REPO,
    tag: null,
    version: null,
    publishedAt: null,
    htmlUrl: `https://github.com/${REPO}/releases/latest`,
    fetchedAt: new Date().toISOString(),
    source: "fallback",
    assets: {},
    beta: null,
  };
}

async function main() {
  let channels;
  try {
    channels = await fetchChannels();
  } catch (error) {
    const previous = await existing();
    console.warn(
      `[release] GitHub lookup failed (${error.message}); keeping ${
        previous ? `snapshot ${previous.tag}` : "no snapshot"
      }.`,
    );
    if (previous) return;
    await writeFile(OUT, JSON.stringify(fallback(), null, 2) + "\n");
    return;
  }

  const { stable, beta } = channels;
  if (!stable) throw new Error("no stable release returned by GitHub");

  const payload = {
    repo: REPO,
    ...describe(stable),
    fetchedAt: new Date().toISOString(),
    source: "github-api",
    beta: beta ? describe(beta) : null,
  };
  delete payload.prerelase;

  await writeFile(OUT, JSON.stringify(payload, null, 2) + "\n");
  console.log(
    `[release] stable ${payload.tag} (${Object.keys(payload.assets).length} assets)` +
      `, beta ${payload.beta?.tag ?? "none"} (${Object.keys(payload.beta?.assets ?? {}).length} assets)` +
      " → public/release.json",
  );
}

await main();
