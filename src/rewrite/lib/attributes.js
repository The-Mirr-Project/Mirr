import rewriteUrl from "./url.js";

function rewriteAttributes(el, prefix, base) {
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
  for (const attr of URL_ATTRS) {
    if (!el.hasAttribute?.(attr)) continue;
    const val = el.getAttribute(attr);
    if (!val) continue;

    const attr_fx = attr.toLowerCase();

    if (attr_fx === "srcset") {
      const rewritten = val
        .split(",")
        .map((part) => {
          const [url, descriptor] = part.trim().split(/\s+/, 2);
          return (
            rewriteUrl(url, prefix, base) + (descriptor ? ` ${descriptor}` : "")
          );
        })
        .join(", ");
      el.setAttribute(attr, rewritten);
    } else if (attr_fx === "style") {
      el.setAttribute(
        attr,
        val.replace(/url\(([^)]+)\)/g, (_, u) => {
          const clean = u.trim().replace(/^['"]|['"]$/g, "");
          return `url("${rewriteUrl(clean, prefix, base)}")`;
        }),
      );
    } else {
      el.setAttribute(attr, rewriteUrl(val, prefix, base));
    }
  }
}

export default rewriteAttributes;
