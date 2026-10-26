/**
 * ESA Pages edge function — on-demand download freshness check.
 *
 * Route it in the ESA console to `/dl/*` only (do NOT route `/`, otherwise the
 * static site goes through the function). When a request arrives the function:
 *
 *   1. asks the mirror whether the requested `<tag>/<file>` exists;
 *   2. if it does, answers 302 to the immutable mirror URL (ESA then caches the
 *      bytes, so repeat downloads never touch the origin again);
 *   3. if it does not, kicks the `mirror-release` workflow once per tag per
 *      10 minutes and answers 302 to GitHub's latest alias, so this visitor
 *      still gets the file while the mirror catches up.
 *
 * Environment (ESA console → 函数 → 环境变量):
 *   DL_ORIGIN             mirror base, e.g. https://dl.aeoform.com
 *   GH_REPO               aeoform/openless-workspace
 *   GH_DISPATCH_TOKEN     PAT with `contents: read` + `actions: write`
 */

const DISPATCH_TTL_MS = 10 * 60 * 1000;

async function sha1(text) {
  const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function recentlyDispatched(tag) {
  try {
    const hit = await caches.default.match(new Request(`https://edge.internal/dispatch/${await sha1(tag)}`));
    return Boolean(hit);
  } catch {
    return false;
  }
}

async function markDispatched(tag, ctx) {
  const request = new Request(`https://edge.internal/dispatch/${await sha1(tag)}`);
  const put = caches.default.put(
    request,
    new Response("1", { headers: { "cache-control": `max-age=${DISPATCH_TTL_MS / 1000}` } }),
  );
  if (ctx?.waitUntil) ctx.waitUntil(put); else await put;
}

async function triggerMirror(env, tag, ctx) {
  if (!env.GH_DISPATCH_TOKEN || !env.GH_REPO) return;
  if (await recentlyDispatched(tag)) return;
  const call = fetch(`https://api.github.com/repos/${env.GH_REPO}/dispatches`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.GH_DISPATCH_TOKEN}`,
      accept: "application/vnd.github+json",
      "content-type": "application/json",
      "user-agent": "openless-edge",
    },
    body: JSON.stringify({ event_type: "mirror-release", client_payload: { tag } }),
  }).catch(() => null);
  if (ctx?.waitUntil) ctx.waitUntil(call); else await call;
  await markDispatched(tag, ctx);
}

const handler = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = (env.DL_ORIGIN || "https://dl.aeoform.com").replace(/\/$/, "");

    // /dl/<tag>/<file>  →  mirror path
    const match = /^\/dl\/([^/]+)\/(.+)$/.exec(decodeURI(url.pathname));
    if (!match) {
      return new Response("not found", { status: 404 });
    }
    const [, tag, file] = match;
    const mirrorUrl = `${origin}/releases/${encodeURIComponent(tag)}/${encodeURIComponent(file)}`;

    let exists = false;
    try {
      const probe = await fetch(mirrorUrl, { method: "HEAD" });
      exists = probe.ok;
    } catch {
      exists = false;
    }

    if (exists) {
      return new Response(null, {
        status: 302,
        headers: { location: mirrorUrl, "cache-control": "no-store" },
      });
    }

    await triggerMirror(env, tag, ctx);
    return new Response(null, {
      status: 302,
      headers: {
        location: `https://github.com/Open-Less/openless/releases/latest/download/${encodeURIComponent(file)}`,
        "cache-control": "no-store",
      },
    });
  },
};

export default handler;
