#!/usr/bin/env bash
# Watches upstream for a new release and kicks the mirror workflow.
#
# GitHub's own `schedule:` cron is heavily delayed on idle repos — measured gaps
# of 4.5 to 9.5 hours on this project — so the mirror could lag most of a day
# behind a release. This timer polls the API directly (12 requests/hour, well
# inside the anonymous limit) and fires a repository_dispatch as soon as the tag
# set changes.
#
# Requires a token in /root/openless-dl/gh_token with:
#   Contents: read   Actions: write     on aeoform/openless-workspace
# Without it the script only records state and exits quietly.
set -euo pipefail

REPO_UPSTREAM="${REPO_UPSTREAM:-Open-Less/openless}"
REPO_MIRROR="${REPO_MIRROR:-aeoform/openless-workspace}"
STATE=/root/openless-dl/last-seen.txt
TOKEN_FILE=/root/openless-dl/gh_token
LOG=/var/log/openless-dl-watch.log

log() { printf '%s %s\n' "$(date -u +%FT%TZ)" "$*" >>"$LOG"; }

releases=$(curl -fsS -m 20 \
  -H "Accept: application/vnd.github+json" \
  -H "User-Agent: openless-mirror-watch" \
  "https://api.github.com/repos/${REPO_UPSTREAM}/releases?per_page=12") || {
  log "api request failed; keeping previous state"
  exit 0
}

# Fingerprint: newest tags plus the asset count, so freshly uploaded assets on an
# existing tag (re-uploads do happen) also trigger a re-mirror.
fingerprint=$(printf '%s' "$releases" | python3 -c '
import json, sys
data = json.load(sys.stdin)
tags = [r["tag_name"] for r in data if not r["draft"]][:6]
assets = sum(len(r.get("assets", [])) for r in data if not r["draft"])
print("|".join(tags) + "|assets:" + str(assets))
')

previous=$(cat "$STATE" 2>/dev/null || echo "")
if [ "$fingerprint" = "$previous" ]; then
  exit 0
fi

log "change detected: ${fingerprint}"

if [ ! -s "$TOKEN_FILE" ]; then
  log "no token at $TOKEN_FILE; recording state without dispatching"
  printf '%s\n' "$fingerprint" >"$STATE"
  exit 0
fi

token=$(tr -d '\r\n' <"$TOKEN_FILE")
code=$(curl -sS -o /tmp/dispatch.out -w '%{http_code}' -m 20 \
  -X POST \
  -H "Authorization: Bearer ${token}" \
  -H "Accept: application/vnd.github+json" \
  -H "User-Agent: openless-mirror-watch" \
  -d '{"event_type":"mirror-release"}' \
  "https://api.github.com/repos/${REPO_MIRROR}/dispatches") || code=000

if [ "$code" = "204" ]; then
  log "dispatched mirror-release"
  printf '%s\n' "$fingerprint" >"$STATE"
else
  log "dispatch failed with HTTP ${code}: $(head -c 200 /tmp/dispatch.out)"
fi
