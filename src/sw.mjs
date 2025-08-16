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
      console.log(`[SW] fetched ${targetUrl}`);

      const spoofedHeaders = new Headers();
      // yoinked from the tor browser
      spoofedHeaders.set(
        "User-Agent",
        "Mozilla/5.0 (Windows NT 10.0; rv:115.0) Gecko/20100101 Firefox/115.0",
      );
      spoofedHeaders.set("Connection", "keep-alive");
      spoofedHeaders.set("Upgrade-Insecure-Requests", "1");
      spoofedHeaders.set(
        "Accept",
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      );
      spoofedHeaders.set("Accept-Language", "en-US,en;q=0.5");
      spoofedHeaders.set("Accept-Encoding", "gzip, deflate, br");

      const response = await client.fetch(targetUrl, {
        headers: spoofedHeaders,
      });

      const mime = response.headers.get("Content-Type") || "";

      // clone headers so they can be modified
      const headers = new Headers(response.headers);

      // csp to prevent IP leaks (also get rid of x frame options so embedding works)
      headers.set("X-Frame-Options", "SAMEORIGIN");
      headers.set(
        "Content-Security-Policy",
        "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
          "style-src 'self' 'unsafe-inline'; " +
          "style-src-elem 'self' 'unsafe-inline'; " +
          "font-src 'self'; " +
          "img-src 'self' data:; " +
          "object-src 'self'; " +
          "base-uri 'self'; " +
          "form-action 'self'; " +
          "worker-src 'self'; " +
          "manifest-src 'self'; " +
          "block-all-mixed-content; " +
          "upgrade-insecure-requests",
      );

      if (
        mime.includes("text/html") ||
        mime.includes("application/xhtml+xml")
      ) {
        // Buffer and rewrite HTML bodies
        const text = await response.text();
        const rewritten = rewriteHtml(text, url);
        return new Response(rewritten, { headers });
      }

      if (
        mime.includes("application/javascript") ||
        mime.includes("text/javascript")
      ) {
        // Buffer and rewrite JS bodies
        const text = await response.text();
        const rewritten = rewriteJavascript(text, url);
        return new Response(rewritten, { headers });
      }

      // For all other content types (images, binaries, downloads, etc),
      // stream the response body directly without buffering
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    // For requests outside proxy prefix, just passthrough
    return fetch(request);
  } catch (e) {
    return new Response("Fetch failed: " + e, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

export { handleRequest };
