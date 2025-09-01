function resolveUrl(url) {
  const base = document.baseURI || $mirr$location.href;
  return new URL(url, base).href;
}

export default resolveUrl;
