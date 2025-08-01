import rewriteAttributes from "../rewrite/lib/attributes.js";
import rewriteJavascript from "../rewrite/js.js";

function rewriteScript(el) {
  const isInline = el.tagName?.toLowerCase() === "script" && !el.src;

  if (!isInline) return;

  console.log("[MutObs] Rewrote javascript for inline script");
  el.textContent = rewriteJavascript(el.textContent);
}

function rewriteOnAttr(el) {
  [...el.attributes].forEach(attr => {
    if (!attr.name.startsWith("on")) return;
    try {
      el.setAttribute(attr.name, rewriteJavascript(attr.value));
      console.log("[MutObs] Rewrote Javascript for on* event");
    } catch (e) {
      console.warn(`[MutObs] Failed to rewrite inline event handler ${attr.name}:`, e);
    }
  });
}

function initMutObs() {
  const prefix = $mirr.prefix;
  const base = new URL($mirr$location.href);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        rewriteAttributes(node, prefix, base);
        rewriteScript(node);
        rewriteOnAttr(node);

        const descendants = node.querySelectorAll?.("*") ?? [];
        for (const el of descendants) {
          rewriteAttributes(el, prefix, base);
          rewriteScript(el);
          rewriteOnAttr(el);
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
