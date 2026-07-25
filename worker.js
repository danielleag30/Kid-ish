/**
 * Storybook Maker — Ollama Cloud proxy (Cloudflare Worker)
 *
 * Why this exists:
 *   The iPad's browser can't call Ollama Cloud directly (Ollama Cloud doesn't
 *   send the CORS headers a browser requires). This tiny Worker sits in the
 *   middle: it holds your Ollama API key as a server-side secret (so the key is
 *   never on the reader's device), adds the CORS header the browser needs, and
 *   forwards the request to Ollama Cloud — streaming the reply straight back.
 *
 * Setup (see README "Step by step"):
 *   1. Create the Worker, paste this file.
 *   2. Add a secret named  OLLAMA_API_KEY  (your key from ollama.com/settings/keys).
 *   3. (Recommended) Add a plain variable  ALLOWED_ORIGIN  set to your app's URL,
 *      e.g.  https://danielleag30.github.io  — this stops other websites from
 *      using your Worker (and your Ollama credits).
 */

const OLLAMA_URL = "https://ollama.com/v1/chat/completions";

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGIN || "*";

    // If you locked it to one origin, reject browser calls from anywhere else.
    if (allowed !== "*" && origin && origin !== allowed) {
      return new Response("Not allowed", { status: 403 });
    }
    const cors = corsHeaders(allowed === "*" ? "*" : origin || allowed);

    // Browser CORS pre-flight check.
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method === "GET") {
      // Friendly health check: open the Worker URL in a browser to verify it's live.
      return new Response("Storybook Maker proxy is running ✨", {
        status: 200,
        headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    if (request.method !== "POST") {
      return new Response("Only POST is allowed", { status: 405, headers: cors });
    }
    if (!env.OLLAMA_API_KEY) {
      return new Response("Worker is missing the OLLAMA_API_KEY secret", {
        status: 500,
        headers: cors,
      });
    }

    // Forward the body verbatim to Ollama Cloud, injecting the secret key.
    const upstream = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + env.OLLAMA_API_KEY,
      },
      body: request.body,
    });

    // Pass the (possibly streaming) response back, with CORS added.
    const headers = new Headers(upstream.headers);
    for (const [k, v] of Object.entries(cors)) headers.set(k, v);
    // Let the edge re-encode the (streaming) body cleanly — a stale length or
    // encoding header from upstream can truncate the stream.
    headers.delete("content-encoding");
    headers.delete("content-length");
    return new Response(upstream.body, { status: upstream.status, headers });
  },
};

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}
