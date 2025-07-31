import { $mirr$location } from "./location";

let $mirr$history = {
  back: () => {
    history.back();
  },
  forward: () => {
    history.forward();
  },
  go: (x) => {
    history.go(x);
  },
  get length() {
    return history.length;
  },
  pushState: (state, title, url) => {
    history.pushState(
      state,
      title,
      location.origin + $mirr.prefix + new URL(url, $mirr$location.href).href,
    );
  },
  replaceState: (state, title, url) => {
    history.replaceState(
      state,
      title,
      location.origin + $mirr.prefix + new URL(url, $mirr$location.href).href,
    );
  },
};

export { $mirr$history };
