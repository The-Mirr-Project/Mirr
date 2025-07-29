function initMutObs() {
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

  const prefix = $mirr.prefix;
  const base = new URL($mirr$location.origin);

  function rewriteUrl(url) {
    if (!url || typeof url !== "string") return url;

    const url_t = url.trim();
    // skip javascript:, mailto:, and tel:
    if (/^(javascript|mailto|tel):/i.test(url_t)) return url_t;
    if (/^data:(?!image\/)/i.test(url_t)) return "#";
    if (url_t.startsWith(prefix)) return url_t;

    try {
      const resolved = new URL(url_t, base).href;
      return prefix + resolved;
    } catch {
      return url_t;
    }
  }

  function rewriteAttributes(el) {
    for (const attr of URL_ATTRS) {
      if (!el.hasAttribute?.(attr)) continue;
      const val = el.getAttribute(attr);
      if (!val) continue;

      const attr_fx = attr.toLowerCase();
      if (attr_fx === "srcset") {
        const rewritten = val
          .split(",")
          .map((part) => {
            const [url, descriptor] = part.trim().split(/\\s+/, 2);
            return rewriteUrl(url) + (descriptor ? ` ${descriptor}` : "");
          })
          .join(", ");
        el.setAttribute(attr, rewritten);
      } else if (attr_fx === "style") {
        el.setAttribute(
          attr,
          val.replace(/url\\(([^)]+)\\)/g, (_, u) => {
            const clean = u.trim().replace(/^['"]|['"]$/g, "");
            return `url("${rewriteUrl(clean)}")`;
          }),
        );
      } else {
        el.setAttribute(attr, rewriteUrl(val));
      }
    }
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        rewriteAttributes(node);
        const descendants = node.querySelectorAll?.("*") ?? [];
        for (const el of descendants) {
          rewriteAttributes(el);
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

export { initMutObs };
