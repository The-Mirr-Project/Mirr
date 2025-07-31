import { $mirr$fetch } from "./client/fetch.js";
import { $mirr$location } from "./client/location.js";
import { $mirr$open } from "./client/open.js";
import { $mirr$navigator } from "./client/navigator.js";
import { $mirr$history } from './client/history.js'

import { initMutObs } from "./client/mutobs.js";

Object.assign(globalThis, {
  $mirr$fetch,
  $mirr$location,
  $mirr$open,
  $mirr$navigator,
  $mirr$history
});

initMutObs();
