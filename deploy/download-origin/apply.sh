#!/usr/bin/env bash
# Install or refresh the download origin on the ECS. Safe to re-run.
set -euo pipefail

SRC=/root/openless-dl

install -d -m 0755 /srv/openless-dl/releases
install -m 0644 "$SRC/nginx.conf" /etc/nginx/conf.d/openless-dl.conf
chmod 0755 "$SRC/sync.sh"
install -m 0644 "$SRC/openless-dl-sync.service" /etc/systemd/system/openless-dl-sync.service
install -m 0644 "$SRC/openless-dl-sync.timer" /etc/systemd/system/openless-dl-sync.timer

systemctl daemon-reload
systemctl enable --now openless-dl-sync.timer
nginx -t
systemctl reload nginx
systemctl start openless-dl-sync.service || true
echo "download origin ready on :8080 (root /srv/openless-dl)"
