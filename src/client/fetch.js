import "../config.js";
import { $mirr } from "../config.js";

let oldfetch = fetch;
const $mirr$fetch = (url, init) =>
  oldfetch(
    location.origin +
      $mirr.prefix +
      (url.startsWith("https:") || url.startsWith("http:")
        ? url
        : url.startsWith("//")
          ? "https:" + url
          : url.startsWith("/")
            ? $mirr$location.origin + url
            : new URL(url, new URL($mirr$location.href)).href),
    { ...init, redirect: "follow" },
  );

window.fetch = $mirr$fetch;
globalThis.fetch = $mirr$fetch;
self.fetch = $mirr$fetch;
console.log("[CLIENT] patched fetch on window, globalThis, and self");
export { $mirr$fetch };
