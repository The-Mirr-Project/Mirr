import { parseDocument, DomUtils } from "htmlparser2";
import serialize from "dom-serializer";
import rewriteAttributes from "../lib/attributes.js";
import rewriteJavascript from "../javascript/main.js";

function getOrigin(requestUrl) {
  if (!requestUrl.pathname.startsWith(globalThis.$mirr.prefix)) return null;
  const encoded = requestUrl.pathname.slice(globalThis.$mirr.prefix.length);
  try {
    const decoded = decodeURIComponent(decodeURIComponent(encoded));
    return decoded;
  } catch {
    return encoded;
  }
}

function rewriteHtml(html, requestUrl) {
  const origin = getOrigin(requestUrl);
  if (!origin) return html;

  const base = new URL(origin);
  const prefix = globalThis.$mirr.prefix;

  const dom = parseDocument(html);
  const nodes = DomUtils.findAll(() => true, dom, true);

  for (const node of nodes) {
    rewriteAttributes(node, prefix, base);
    // Inline <script> rewriting
    if (
      node.name === "script" &&
      Array.isArray(node.children) &&
      node.children.length &&
      node.children[0].type === "text" &&
      node.children[0].data?.trim()
    ) {
      try {
        node.children[0].data = rewriteJavascript(node.children[0].data);
        console.log("[SW] Rewrote JS for <script> tag");
      } catch (e) {
        console.warn("[SW] JS rewrite failed for a <script> tag:", e);
      }
    }

    // rewrite the js for on*
    if (node.attribs) {
      for (const attr in node.attribs) {
        if (attr.toLowerCase().startsWith("on")) {
          try {
            node.attribs[attr] = rewriteJavascript(node.attribs[attr]);
            console.log("[SW] Rewrote JS for an on* event");
          } catch (e) {
            console.warn(`[SW] JS rewrite failed for an on* event ${attr}:`, e);
          }
        }
      }
    }
  }

  console.log(`[SW] Rewrote HTML ${requestUrl}`);

  // Inject client script at start of <head>
  let asString = serialize(dom);
  return asString.replace(
    /<head(\s*[^>]*)?>/,
    (match) => `${match}\n<script src="${$mirr.client}"></script>`,
  );
}

export default rewriteHtml;
