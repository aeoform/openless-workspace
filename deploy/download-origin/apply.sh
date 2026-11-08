#!/usr/bin/env bash
# Install or refresh the download origin on the ECS. Safe to re-run.
#
#   apply.sh proxy    nginx fetches from OSS on demand (nothing else runs here)
#   apply.sh static   nginx serves /srv/openless-dl, fed by the sync timer
set -euo pipefail

SRC=/root/openless-dl
MODE="${1:-proxy}"

case "$MODE" in
  proxy)
    install -d -m 0755 /var/cache/openless-dl /etc/nginx/njs
    # njs lets nginx sign OSS requests, so the bucket can stay private.
    if ! dpkg -s libnginx-mod-http-js >/dev/null 2>&1; then
      DEBIAN_FRONTEND=noninteractive apt-get -qq install -y libnginx-mod-http-js
    fi
    ak=$(awk -F' = ' '/^access_key_id/{print $2}' /root/.config/rclone/rclone.conf | head -1)
    sk=$(awk -F' = ' '/^secret_access_key/{print $2}' /root/.config/rclone/rclone.conf | head -1)
    bucket=$(awk -F' = ' '/^bucket/{print $2}' /root/.config/rclone/rclone.conf | head -1)
    [ -n "$ak" ] && [ -n "$sk" ] || { echo "no OSS credentials in rclone.conf" >&2; exit 1; }
    sed -e "s|__AK__|$ak|" -e "s|__SK__|$sk|" -e "s|__BUCKET__|${bucket:-openless-backend}|" \
      "$SRC/oss_sign.js.tmpl" > /etc/nginx/njs/oss_sign.js
    chmod 0600 /etc/nginx/njs/oss_sign.js
    install -m 0644 "$SRC/nginx.proxy.conf" /etc/nginx/conf.d/openless-dl.conf
    # Nothing should be polling anything on this host.
    systemctl disable --now openless-dl-sync.timer openless-dl-watch.timer 2>/dev/null || true
    rm -f /etc/systemd/system/openless-dl-sync.{service,timer}
    rm -f /etc/systemd/system/openless-dl-watch.{service,timer}
    systemctl daemon-reload
    ;;
  static)
    install -d -m 0755 /srv/openless-dl/releases
    install -m 0644 "$SRC/nginx.static.conf" /etc/nginx/conf.d/openless-dl.conf
    chmod 0755 "$SRC/sync.sh"
    install -m 0644 "$SRC/openless-dl-sync.service" /etc/systemd/system/openless-dl-sync.service
    install -m 0644 "$SRC/openless-dl-sync.timer" /etc/systemd/system/openless-dl-sync.timer
    systemctl daemon-reload
    systemctl enable --now openless-dl-sync.timer
    systemctl start openless-dl-sync.service || true
    ;;
  *)
    echo "usage: $0 [proxy|static]" >&2; exit 2 ;;
esac

nginx -t
systemctl reload nginx
echo "download origin ready (${MODE}) on :80 / :8080"
