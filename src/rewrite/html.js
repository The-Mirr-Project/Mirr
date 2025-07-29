import { parseDocument, DomUtils } from "htmlparser2";
import serialize from "dom-serializer";

const URL_ATTRS = [
  "href",
  "src",
  "srcset",
  "action",
  "formaction",
  "poster",
  "data",
  "ping",
  "longdesc",
  "background",
  "cite",
  "xlink:href",
  "usemap",
  "archive",
  "codebase",
  "style",
];

// updated getOrigin for $mirr
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

function rewriteUrl(url, base, prefix) {
  if (!url || typeof url !== "string") return url;

  const url_t = url.trim();
  // if it's javascript:, mailto:, tel:, pass through without rewriting
  if (/^(javascript|mailto|tel):/i.test(url_t)) return url_t;
  // data: except image/* becomes #
  if (/^data:(?!image\/)/i.test(url_t)) return "#";
  // skip if already rewritten
  if (url_t.startsWith(prefix)) return url_t;

  try {
    const resolved = new URL(url_t, base).href;
    return prefix + resolved;
  } catch {
    return url_t;
  }
}

function rewriteAttributes(node, base, prefix) {
  if (!node.attribs) return;

  for (const [attr, val] of Object.entries(node.attribs)) {
    if (!val) continue;
    const attr_fx = attr.toLowerCase();
    if (!URL_ATTRS.includes(attr_fx)) continue;

    if (attr_fx === "srcset") {
      node.attribs[attr] = val
        .split(",")
        .map((part) => {
          const [url, descriptor] = part.trim().split(/\s+/, 2);
          return (
            rewriteUrl(url, base, prefix) + (descriptor ? ` ${descriptor}` : "")
          );
        })
        .join(", ");
    } else if (attr_fx === "style") {
      node.attribs[attr] = val.replace(/url\(([^)]+)\)/g, (_, u) => {
        const clean = u.trim().replace(/^['"]|['"]$/g, "");
        return `url("${rewriteUrl(clean, base, prefix)}")`;
      });
    } else {
      node.attribs[attr] = rewriteUrl(val, base, prefix);
    }
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
  // plop the client right at the start of the <head> (yes ik regex bad)
  let asString = serialize(dom);
  return asString.replace(
    /<head(\s*[^>]*)?>/,
    (match) => `${match}\n<script src="${$mirr.client}"></script>`,
  );
}

export default rewriteHtml;
