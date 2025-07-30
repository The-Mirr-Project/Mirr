import { parseDocument, DomUtils } from "htmlparser2";
import serialize from "dom-serializer";
import rewriteAttributes from "./lib/attributes.js";

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
  const nodes = DomUtils.findAll(() => true, dom.children);

  for (const node of nodes) {
    rewriteAttributes(node, base, prefix);
  }
  console.log(`[SW] Rewrote HTML ${requestUrl}`);
  // plop the client right at the start of the <head> (yes ik regex bad)
  let asString = serialize(dom);
  return asString.replace(
    /<head(\s*[^>]*)?>/,
    (match) => `${match}\n<script src="${$mirr.client}"></script>`,
  );
}

export default rewriteHtml;
