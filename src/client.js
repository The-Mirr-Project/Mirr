import { $mirr$fetch } from "./client/fetch.js";
import { $mirr$location } from "./client/location.js";
import { $mirr$navigator } from "./client/navigator.js";
import { $mirr$history } from "./client/history.js";

import { patchCookie } from "./client/cookie.js";
import { patchWebSocket } from "./client/websocket.js";
import { initMutObs } from "./client/mutobs.js";

import "./client/open.js" // patch open to go thru proxy
import "./client/baseURI.js"; // patch baseURI to not be shite

Object.assign(globalThis, {
  $mirr$fetch,
  $mirr$location,
  $mirr$navigator,
  $mirr$history,
});

patchCookie();
patchWebSocket();
initMutObs();
