import "../config.js";

function $mirr$fetch(url, init) {
  let rewritten;
  const prefix = url.startsWith("https:")
    ? "http"
    : url.startsWith("http:")
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

    case "other": {
      const base = new URL($mirr$location.href);
      rewritten = location.origin + $mirr.prefix + new URL(url, base).href;
      break;
    }
  }

  console.log(`Fetching ${rewritten} ($mirr$fetch)`);

  // Force redirect: 'follow' to fix no-cors redirect issues:
  const fetchInit = { ...init, redirect: "follow" };

  return fetch(rewritten, fetchInit);
}

export { $mirr$fetch };
