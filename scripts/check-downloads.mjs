#!/usr/bin/env node
/**
 * Audits every mirror URL the built site links to.
 *
 * Usage: node scripts/check-downloads.mjs [out-dir]
 *
 * Exits non-zero if any installer 404s, which is exactly the class of bug we
 * hit when beta-only assets fell back to GitHub's `latest` alias.
 */
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const OUT = resolve(process.argv[2] ?? "out");
const PAGES = ["index.html", "download/index.html", "docs/index.html"];
const PATTERN = /https:\/\/[^"'\\\s]*\/releases\/[^"'\\\s]+/g;

async function collect() {
  const urls = new Set();
  for (const page of PAGES) {
    const path = resolve(OUT, page);
    if (!existsSync(path)) continue;
    const html = await readFile(path, "utf8");
    for (const match of html.matchAll(PATTERN)) {
      // Release pages (`releases/latest`, `releases/tag/<tag>`) are not assets.
      const last = match[0].split("/").pop() ?? "";
      if (last.includes(".") || last === "SHA256SUMS") urls.add(match[0]);
    }
  }
  return [...urls].sort();
}

async function probe(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Range: "bytes=0-1023" },
      signal: AbortSignal.timeout(15_000),
    });
    await response.body?.cancel();
    return response.status;
  } catch (error) {
    return `ERR ${error.message}`;
  }
}

const urls = await collect();
console.log(`checking ${urls.length} mirror URL(s) from ${OUT}\n`);

let failures = 0;
for (const url of urls) {
  const status = await probe(url);
  const ok = status === 200 || status === 206;
  if (!ok) failures += 1;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${String(status).padEnd(4)} ${url.split("/releases/").pop()}`);
}

console.log(`\n${urls.length - failures}/${urls.length} reachable`);
if (failures > 0) process.exitCode = 1;
