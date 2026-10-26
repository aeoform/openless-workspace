#!/usr/bin/env bash
# Pull mirrored installers from OSS over the internal endpoint (free of public
# egress charges) into the directory nginx serves.
set -euo pipefail

REMOTE="${RCLONE_REMOTE:-oss:openless-backend/releases}"
LOCAL="${DL_ROOT:-/srv/openless-dl/releases}"

install -d -m 0755 "$LOCAL"
rclone sync "$REMOTE" "$LOCAL" \
  --checksum \
  --transfers 4 \
  --create-empty-src-dirs \
  --log-file /var/log/openless-dl-sync.log \
  --log-level INFO \
  --stats 0
