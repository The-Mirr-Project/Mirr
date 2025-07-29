// used in both SW And client, so dont do anything specific to either

let $mirr = {
  prefix: "/mirr/route/",
  client: "/client.js",
};

self.$mirr = $mirr;

export { $mirr };
