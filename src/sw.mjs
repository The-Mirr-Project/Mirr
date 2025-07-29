//import "./serverClient.js";
import "./config.js";
import rewriteHtml from "./rewrite/html.js";
import rewriteJavascript from "./rewrite/js.js";

import { BareClient } from "@mercuryworkshop/bare-mux";

self.addEventListener("fetch", (e) => {
  e.respondWith(handleRequest(e.request));
});

async function handleRequest(request) {
  try {
    const client = new BareClient();

    const url = new URL(request.url);

    if (url.pathname.startsWith($mirr.prefix)) {
      const targetUrl =
        decodeURIComponent(url.pathname.slice($mirr.prefix.length)) +
        url.search;
      console.log(`Fetching ${targetUrl} using baremux`);
      const response = await client.fetch(targetUrl);
      const mime = response.headers.get("Content-Type") || "";

      const headers = new Headers(response.headers);
      headers.set(
        "Content-Security-Policy",
        "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
          "style-src 'self' 'unsafe-inline'; " +
          "style-src-elem 'self' 'unsafe-inline'; " +
          "font-src 'self'; " +
          "img-src 'self' data:; " +
          "connect-src 'self'; " +
          "object-src 'self'; " +
          "base-uri 'self'; " +
          "form-action 'self'; " +
          "worker-src 'self'; " +
          "manifest-src 'self'; " +
          "block-all-mixed-content; " +
          "upgrade-insecure-requests",
      );
      headers.set("X-Frame-Options", "SAMEORIGIN");
      if (
        mime.includes("text/html") ||
        mime.includes("application/xhtml+xml")
      ) {
        const text = await response.text();
        const rewritten = rewriteHtml(text, url);
        return new Response(rewritten, { headers });
      }

      if (
        mime.includes("application/javascript") ||
        mime.includes("text/javascript")
      ) {
        const text = await response.text();
        const rewritten = rewriteJavascript(text, url);
        return new Response(rewritten, { headers });
      }

      const raw = await response.arrayBuffer();
      return new Response(raw, { headers });
    }
    return fetch(request);
  } catch (e) {
    return new Response("Fetch failed: " + e, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

export { handleRequest };
