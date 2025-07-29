import $mirr from "../config.js";

function $mirr$open(url, target, windowFeatures) {
  let prefix = url.startsWith("/")
    ? "path-relative"
    : url.startsWith("https:") || url.startsWith("http:")
      ? "absolute"
      : "other";

  switch (prefix) {
    case "path-relative":
      url = $mirr.prefix + $mirr$location.origin + url;
      break;

    case "absolute":
      url = $mirr.prefix + url;
      break;

    default:
      // we can do nothing since its going to be like open("hi") which will still be proxied
      break;
  }

  open(url, target, windowFeatures);
}

export default $mirr$open;
