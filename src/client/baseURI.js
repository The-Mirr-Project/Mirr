Object.defineProperty(document, "baseURI", {
  get() {
    let maybeBase = document.querySelector("base");
    if (maybeBase) {
      return new URL(maybeBase.href, $mirr$location.origin).href;
    }
    return $mirr$location.href;
  },
  configurable: true,
});
