#!/usr/bin/env bash
# Pull mirrored installers from OSS over the internal endpoint (free of public
# egress charges) into the directory nginx serves.
set -euo pipefail

BUCKET="${RCLONE_BUCKET:-oss:openless-backend}"
ROOT="${DL_ROOT:-/srv/openless-dl}"

install -d -m 0755 "$ROOT/releases" "$ROOT/updates"
# Updater manifests live outside releases/ so the app can poll a stable URL.
rclone sync "${BUCKET}/updates" "$ROOT/updates" \
  --checksum \
  --create-empty-src-dirs \
  --log-file /var/log/openless-dl-sync.log \
  --log-level INFO \
  --stats 0

rclone sync "${BUCKET}/releases" "$ROOT/releases" \
  --checksum \
  --transfers 4 \
  --create-empty-src-dirs \
  --log-file /var/log/openless-dl-sync.log \
  --log-level INFO \
  --stats 0
