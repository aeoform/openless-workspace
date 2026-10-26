#!/usr/bin/env python3
"""Point Tauri updater manifests at our mirror instead of GitHub.

Usage: rewrite-manifests.py <stage-dir> <mirror-base>

Each staged manifest carries a `url` field that the updater downloads. GitHub
serves those payloads at 2 MB/s from here, the mirror at 30-70 MB/s, and the
signature is checked against the payload (not the URL), so the field can be
rewritten safely. Manifests whose payload we did not mirror are left untouched.
"""

from __future__ import annotations

import glob
import json
import os
import sys
import urllib.parse


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__, file=sys.stderr)
        return 2
    stage_dir, base = sys.argv[1], sys.argv[2].rstrip("/")

    rewritten = skipped = 0
    for tag_dir in sorted(glob.glob(os.path.join(stage_dir, "*"))):
        if not os.path.isdir(tag_dir):
            continue
        tag = os.path.basename(tag_dir)
        for path in sorted(glob.glob(os.path.join(tag_dir, "*.json"))):
            with open(path, encoding="utf-8") as fh:
                data = json.load(fh)
            url = data.get("url") or ""
            if not url:
                continue
            name = urllib.parse.unquote(url.rstrip("/").rsplit("/", 1)[-1])
            if not os.path.exists(os.path.join(tag_dir, name)):
                print(f"skip {tag}/{os.path.basename(path)}: {name} not mirrored")
                skipped += 1
                continue
            data["url"] = (
                f"{base}/releases/{urllib.parse.quote(tag)}/{urllib.parse.quote(name)}"
            )
            with open(path, "w", encoding="utf-8") as fh:
                json.dump(data, fh, ensure_ascii=False, indent=2)
                fh.write("\n")
            rewritten += 1

    print(f"rewrote {rewritten} manifest(s) to {base}, skipped {skipped}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
