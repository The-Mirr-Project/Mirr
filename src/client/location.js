import "../config.js";

let $mirrHelpers = {
  get proxiedHref() {
    return decodeURIComponent(
      decodeURIComponent(
        location.href.replace(location.origin, "").replace($mirr.prefix, ""),
      ),
    );
  },
  get protocol() {
    // get href
    let href = location.href
      .replace(location.origin, "")
      .replace($mirr.prefix, "");
    // get protocol
    return href.replace(/:.*/, "") + ":";
  },
  get urlObj() {
    return new URL(this.proxiedHref);
  },
};

let $mirr$location = {
  assign: function (href) {
    location.href = $mirr.codec(href);
  },

  get hash() {
    return location.hash;
  },
  set hash(x) {
    location.hash = x;
  },

  get host() {
    let stripHttp = $mirrHelpers.proxiedHref.replace(/^https?:\/\//, "");
    return stripHttp.replace(/\/.*$/, "");
  },
  set host(x) {
    let params = $mirrHelpers.proxiedHref.split("/").slice(3).join("/") || "";
    let patchedToAqua = location.origin + $mirr.prefix;
    let cleanedSet = x.replace(/\/.*$/, "");
    location.href =
      patchedToAqua + $mirrHelpers.protocol + cleanedSet + "/" + params;
  },

  get hostname() {
    let stripHttp = $mirrHelpers.proxiedHref.replace(/^https?:\/\//, "");
    let stripPath = stripHttp.replace(/\/.*$/, "");
    return stripPath.replace(/:.*$/, "");
  },
  set hostname(x) {
    let params = $mirrHelpers.proxiedHref.split("/").slice(3).join("/") || "";
    let patchedToAqua = location.origin + $mirr.prefix;
    let cleanedSet = x.replace(/\/.*$/, "");

    location.href =
      patchedToAqua + $mirrHelpers.protocol + cleanedSet + "/" + params;
  },

  get href() {
    return $mirrHelpers.proxiedHref;
  },
  set href(x) {
    location.href = location.origin + $mirr.prefix + x;
  },

  get origin() {
    let stripHttp = $mirrHelpers.proxiedHref.replace(/^https?:\/\//, "");
    let cleanedSet = stripHttp.replace(/\/.*$/, "");
    return $mirrHelpers.protocol + "//" + cleanedSet;
  },

  get pathname() {
    try {
      return $mirrHelpers.urlObj.pathname;
    } catch {
      return "/";
    }
  },
  set pathname(x) {
    let url = $mirrHelpers.urlObj;
    url.pathname = x;
    location.href = location.origin + $mirr.prefix + url.href;
  },

  get port() {
    return $mirrHelpers.urlObj.port || "";
  },
  set port(x) {
    let url = $mirrHelpers.urlObj;
    url.port = x;
    location.href = location.origin + $mirr.prefix + url.href;
  },

  get protocol() {
    return $mirrHelpers.protocol;
  },
  set protocol(x) {
    // not really possible to set from here, so redirect
    let url = $mirrHelpers.urlObj;
    url.protocol = x;
    location.href = location.origin + $mirr.prefix + url.href;
  },

  get search() {
    return $mirrHelpers.urlObj.search || "";
  },
  set search(x) {
    let url = $mirrHelpers.urlObj;
    url.search = x;
    location.href = location.origin + $mirr.prefix + url.href;
  },

  reload: function () {
    location.reload();
  },

  replace: function (x) {
    location.href = location.origin + $mirr.prefix + x;
  },
};

export { $mirr$location };
