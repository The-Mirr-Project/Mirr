import "../config.js";

function $mirr$fetch(url, headers) {
  let rewritten;

  let prefix =
    url.startsWith("https:") || url.startsWith("http:")
      ? "http"
      : url.startsWith("//")
        ? "scheme-relative"
        : url.startsWith("/")
          ? "path-relative"
          : "other";

  switch (prefix) {
    case "http":
      rewritten = location.origin + $mirr.prefix + url;
      break;

    case "scheme-relative":
      rewritten = location.origin + $mirr.prefix + "https:" + url;
      break;

    case "path-relative":
      rewritten = location.origin + $mirr.prefix + $mirr$location.origin + url;
      break;

    case "other":
      rewritten =
        location.origin + $mirr.prefix + "https://" + $mirr$location.href + url;
      break;
  }

  console.log(`Fetching ${rewritten} ($mirr$fetch)`);
  return fetch(rewritten, headers);
}

export { $mirr$fetch };
