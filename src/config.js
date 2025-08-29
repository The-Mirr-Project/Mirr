// used in both SW And client, so dont do anything specific to either
// also this is just the default config - you can change any of these
let $mirr = {
  prefix: "/mirr/route/",
  client: "/client.js",
};

self.$mirr = $mirr;

export { $mirr };
