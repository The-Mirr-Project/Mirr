import { $mirr } from "../config.js";

const $mirr$open = (url, target, windowFeatures) =>
  open(
    url.startsWith("/")
      ? $mirr.prefix + $mirr$location.origin + url
      : url.startsWith("http:") || url.startsWith("https:")
        ? $mirr.prefix + url
        : url,
    target,
    windowFeatures,
  );

export { $mirr$open };
