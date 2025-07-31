// soon
const grabCookies = (req) => ({
  cookies: (req.headers.get("Cookie") || "").split(";").reduce((acc, pair) => {
    const [key, ...vals] = pair.split("=");
    if (!key) return acc;
    acc[key.trim()] = vals.join("=").trim();
    return acc;
  }, {}),
  origin: new URL(req.url).origin,
});
