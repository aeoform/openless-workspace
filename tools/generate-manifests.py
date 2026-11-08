#!/usr/bin/env python3
"""Generate Tauri updater manifests from release assets.

Usage: generate-manifests.py <stage-dir> <tag> <channel> <out-dir> <mirror-base>

Upstream only publishes `latest-<os>-<arch>.json` for some releases (2.0.1 had
them, 2.0.2 Beta.4 shipped none), and their `url` points at github.com. This
script builds the same documents from the assets we already mirrored:

    stage/<tag>/OpenLess_aarch64.app.tar.gz        payload
    stage/<tag>/OpenLess_aarch64.app.tar.gz.sig    signature

and writes them twice:
    <out-dir>/latest-darwin-aarch64.json           current name
    <out-dir>/latest-darwin-aarch64-mirror.json    legacy name some clients poll

Nothing is emitted for a platform whose payload or signature is missing.
"""

from __future__ import annotations

import json
import os
import re
import sys
import urllib.parse

# (manifest platform-arch, payload matcher, human note)
TARGETS: list[tuple[str, re.Pattern[str]]] = [
    ("darwin-aarch64", re.compile(r"_aarch64\.app\.tar\.gz$")),
    ("darwin-x86_64", re.compile(r"_x86_64\.app\.tar\.gz$")),
    ("windows-x86_64", re.compile(r"_x64-setup\.exe$")),
    ("android-aarch64", re.compile(r"_arm64-v8a\.apk$")),
    ("android-armv7", re.compile(r"_armeabi-v7a\.apk$")),
    ("android-x86_64", re.compile(r"_x86_64\.apk$")),
    ("android-i686", re.compile(r"_x86\.apk$")),
]


def version_from(assets: list[str], tag: str) -> str:
    """Prefer the human version baked into the asset name, fall back to the tag."""
    for name in assets:
        match = re.search(r"OpenLess_(\d[^_]*?)_(?:aarch64|x64|arm64-v8a|armeabi-v7a|x86_64|x86)", name)
        if match:
            return match.group(1)
    return re.sub(r"^v|-tauri$", "", tag)


def main() -> int:
    if len(sys.argv) != 6:
        print(__doc__, file=sys.stderr)
        return 2
    stage_dir, tag, channel, out_dir, base = sys.argv[1:6]
    base = base.rstrip("/")
    release_dir = os.path.join(stage_dir, tag)
    if not os.path.isdir(release_dir):
        print(f"skip {tag}: not staged")
        return 0

    assets = sorted(os.listdir(release_dir))
    version = version_from(assets, tag)
    pub_date = os.environ.get("PUB_DATE") or ""

    # Signature files may be `x.sig` next to `x`, or the alias copy.
    def signature_for(payload: str) -> str | None:
        for candidate in (payload + ".sig",):
            path = os.path.join(release_dir, candidate)
            if os.path.exists(path):
                with open(path, encoding="utf-8") as fh:
                    return fh.read().strip()
        return None

    os.makedirs(out_dir, exist_ok=True)
    written = 0
    for target, pattern in TARGETS:
        payload = next((name for name in assets if pattern.search(name)), None)
        if not payload:
            continue
        signature = signature_for(payload)
        if not signature:
            print(f"skip {target}: no signature for {payload}")
            continue
        document = {
            "version": version,
            "pub_date": pub_date,
            "url": f"{base}/releases/{urllib.parse.quote(tag)}/{urllib.parse.quote(payload)}",
            "signature": signature,
        }
        body = json.dumps(document, ensure_ascii=False, indent=2) + "\n"
        stem = f"latest-{target}-beta" if channel == "beta" else f"latest-{target}"
        for name in (f"{stem}.json", f"{stem}-mirror.json"):
            with open(os.path.join(out_dir, name), "w", encoding="utf-8") as fh:
                fh.write(body)
            written += 1

    print(f"{channel} {tag}: wrote {written} manifest(s), version {version}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
