import rewriteAttributes from "../rewrite/lib/attributes.js";
function initMutObs() {
  const prefix = $mirr.prefix;
  const base = new URL($mirr$location.href);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        rewriteAttributes(node, prefix, base);
        const descendants = node.querySelectorAll?.("*") ?? [];
        for (const el of descendants) {
          rewriteAttributes(el, prefix, base);
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
