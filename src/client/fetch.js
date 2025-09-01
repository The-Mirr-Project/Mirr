import resolveUrl from "./lib/resolveUrl.js"; 
import { $mirr } from "../config.js";

(() => {
  const oldfetch = window.fetch;

  window.fetch = new Proxy(oldfetch, {
    apply(target, thisArg, args) {
      if (!args[0]) {
        return Reflect.apply(target, thisArg, args);
      }
      args[0] = $mirr.prefix + resolveUrl(args[0]);
      return Reflect.apply(target, thisArg, args);
    },
  });
})();