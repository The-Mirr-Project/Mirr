const format = (str) => str.concat("__$mirr$cookieitem");
// something something functional programming slop
const serialize = (obj) =>
  Object.entries(obj)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");

let $mirr$cookies = {
  get cookie() {
    const raw = localStorage.getItem(format($mirr$location.hostname));
    if (!raw) return "";

    let cookies = {};
    try {
      cookies = JSON.parse(raw);
    } catch {
      return "";
    }

    const now = Date.now();
    const cookiesFixed = {};
    let modded = false;

    for (const [key, meta] of Object.entries(cookies)) {
      if (meta.expires && Date.parse(meta.expires) < now) {
        // it expired, so dont inc it
        modded = true;
        continue;
      }
      cookiesFixed[key] = meta.value;
    }

    if (modded) {
      const updated = {};
      for (const [k, v] of Object.entries(cookiesFixed)) {
        updated[k] = { value: v };
      }
      localStorage.setItem(
        format($mirr$location.hostname),
        JSON.stringify(updated),
      );
    }

    return serialize(cookiesFixed);
  },

  set cookie(str) {
    const parts = str.split(";").map((p) => p.trim());
    const [keyVal, ...attrs] = parts;
    const [key, val] = keyVal.split("=");

    if (!key) return;

    let expires = null;
    for (const attr of attrs) {
      if (attr.toLowerCase().startsWith("expires=")) {
        const dateStr = attr.slice(8);
        const parsed = new Date(dateStr);
        if (!isNaN(parsed)) expires = parsed.toISOString();
      }
    }

    const raw = localStorage.getItem(format($mirr$location.hostname));
    let cookies = {};
    if (raw) {
      cookies = JSON.parse(raw);
    }

    cookies[key.trim()] = {
      value: val?.trim() ?? "",
      ...(expires ? { expires } : {}),
    };

    localStorage.setItem(
      format($mirr$location.hostname),
      JSON.stringify(cookies),
    );
  },
};

const patchCookie = () => {
  Object.defineProperty(document, "cookie", {
    get: () => $mirr$cookies.cookie,
    set: v => { $mirr$cookies.cookie = v },
    configurable: true,
    enumerable: true,
  });
};

export {patchCookie}
