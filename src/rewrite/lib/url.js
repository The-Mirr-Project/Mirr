import rewriteJavascript from "../js.js";

function rewriteUrl(url, prefix, base) {
  if (!url || typeof url !== "string") return url;

  const url_t = url.trim();
  // if ts a javascript:, rewrite it
  if (/^javascript:/i.test(url_t)) {
    const jsCode = url_t.slice("javascript:".length);
    const rewrittenJs = rewriteJavascript(jsCode);
    return "javascript:" + rewrittenJs;
  }
  // otherwise just do nothin
  if (/^(mailto|tel):/i.test(url_t)) return url_t;
  if (/^data:(?!image\/)/i.test(url_t)) return "#";
  if (url_t.startsWith(prefix)) return url_t;

  try {
    const resolved = new URL(url_t, base).href;
    return prefix + resolved;
  } catch {
    return url_t;
  }
}

export default rewriteUrl;
