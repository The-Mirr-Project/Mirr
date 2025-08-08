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
    "content",
    "style",
  ];

  // if its htmlparser2, then go with that
  // if its running in the mutation observer, go with that
  const inSw = !!el.attribs;
  const getAttr = (attr) =>
    inSw ? el.attribs?.[attr] : el.getAttribute?.(attr);
  const hasAttr = (attr) =>
    inSw ? attr in el.attribs : el.hasAttribute?.(attr);
  const setAttr = (attr, val) => {
    if (inSw) el.attribs[attr] = val;
    else el.setAttribute?.(attr, val);
  };

  for (const attr of URL_ATTRS) {
    if (!hasAttr(attr)) continue;

    const val = getAttr(attr);
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
      setAttr(attr, rewritten);
    } else if (attr_fx === "style") {
      const rewritten = val.replace(/url\(([^)]+)\)/g, (_, u) => {
        const clean = u.trim().replace(/^['"]|['"]$/g, "");
        return `url("${rewriteUrl(clean, prefix, base)}")`;
      });
      setAttr(attr, rewritten);
    } else {
      setAttr(attr, rewriteUrl(val, prefix, base));
    }
  }
}

export default rewriteAttributes;
