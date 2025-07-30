import rewriteJavascript from "../js.js";

function rewriteUrl(url, prefix, base) {
  if (!url || typeof url !== "string") return url;

  const trimmed = url.trim();

  if (trimmed.toLowerCase().startsWith("javascript:")) {
    const jsCode = trimmed.slice(11);
    return "javascript:" + rewriteJavascript(jsCode);
  }

  if (trimmed.toLowerCase().startsWith("mailto:") || trimmed.toLowerCase().startsWith("tel:")) {
    return trimmed;
  }
  if (
    trimmed.toLowerCase().startsWith("data:") &&
    !trimmed.toLowerCase().startsWith("data:image/")
  ) {
    return "#";
  }
  if (trimmed.startsWith(prefix)) {
    return trimmed;
  }

  try {
    const resolvedUrl = new URL(trimmed, base).href;
    return prefix + resolvedUrl;
  } catch {
    return trimmed;
  }
}


export default rewriteUrl;
