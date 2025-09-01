import { $mirr } from "../config.js";
import resolveUrl from "./lib/resolveUrl.js";

// IIFE so oldopen cant be accessed (idk if this is needed im tired)
(() => {
  const oldopen = window.open;

  window.open = new Proxy(oldopen, {
    apply(target, thisArg, args) {
      if (!args[0]) {
        return Reflect.apply(target, thisArg, args);
      }
      args[0] = $mirr.prefix + resolveUrl(args[0]);
      return Reflect.apply(target, thisArg, args);
    },
  });
})();
