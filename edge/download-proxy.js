/**
 * ESA edge function: same-origin download proxy for GitHub release assets.
 *
 * /dl/<tag>/<asset-name>  →  https://github.com/Open-Less/openless/releases/download/<tag>/<asset>
 *
 * Only this repository's release path is proxied, so the function cannot be
 * used as an open relay. Asset names are validated and the tag must look like
 * a release tag. Immutable URLs are cached at the edge.
 */
const OWNER = "Open-Less";
const REPO = "openless";
const TAG = /^v[0-9A-Za-z][0-9A-Za-z._+-]{0,63}$/;
const ASSET = /^[0-9A-Za-z][0-9A-Za-z._+-]{0,180}$/;

function notFound(message) {
  return new Response(`<!doctype html><meta charset="utf-8"><title>404</title><p>${message}</p><p><a href="/">OpenLess</a></p>`, {
    status: 404,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

const handler = {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { allow: "GET, HEAD" } });
    }

    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length !== 3 || parts[0] !== "dl") {
      return notFound("Not found.");
    }

    let tag;
    let asset;
    try {
      tag = decodeURIComponent(parts[1]);
      asset = decodeURIComponent(parts[2]);
    } catch {
      return notFound("Invalid download path.");
    }
    // Reject separators and control characters before they reach the upstream URL.
    if (!TAG.test(tag) || !ASSET.test(asset)) {
      return notFound("Invalid download path.");
    }

    const upstream = `https://github.com/${OWNER}/${REPO}/releases/download/${tag}/${encodeURIComponent(asset)}`;
    const headers = { "user-agent": "openless-site-proxy" };
    // Let resume-capable clients continue a partial download.
    const range = request.headers.get("range");
    if (range && /^bytes=\d*-\d*$/.test(range)) headers.range = range;

    let response;
    try {
      response = await fetch(upstream, { method: request.method, headers, redirect: "follow" });
    } catch {
      return new Response("Upstream unreachable", { status: 502, headers: { "cache-control": "no-store" } });
    }

    if (!response.ok && response.status !== 206) {
      // 404 from GitHub means the tag/asset pair does not exist.
      return notFound(`Release asset unavailable (${response.status}).`);
    }

    const out = new Headers();
    out.set("content-type", response.headers.get("content-type") || "application/octet-stream");
    out.set("content-disposition", `attachment; filename="${asset}"`);
    out.set("cache-control", response.status === 206 ? "no-store" : "public, max-age=86400, immutable");
    out.set("x-content-type-options", "nosniff");
    for (const name of ["content-length", "content-range", "accept-ranges", "etag", "last-modified"]) {
      const value = response.headers.get(name);
      if (value) out.set(name, value);
    }

    return new Response(request.method === "HEAD" ? null : response.body, {
      status: response.status,
      headers: out,
    });
  },
};

export default handler;
