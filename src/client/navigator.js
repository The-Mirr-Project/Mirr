// yoinked from the tor browser
const $mirr$navigator = {
  get appCodeName() {
    return navigator.appCodeName;
  },
  get appName() {
    return navigator.appName;
  },
  get appVersion() {
    navigator.appVersion;
  },
  get userAgent() {
    return navigator.userAgent;
  },
  get platform() {
    return navigator.platform;
  },
  get product() {
    return navigator.product;
  },
  get productSub() {
    return navigator.productSub;
  },
  get vendor() {
    return navigator.vendor;
  },
  get vendorSub() {
    return navigator.vendorSub;
  },

  get language() {
    return navigator.language;
  },
  get languages() {
    return navigator.languages;
  },

  get hardwareConcurrency() {
    return 2;
  },
  get deviceMemory() {
    return 2;
  },
  get maxTouchPoints() {
    return 0;
  },
  get cookieEnabled() {
    return false; //for now
  },
  get webdriver() {
    return false;
  },
  get clipboard() {
    return navigator.clipboard;
  },

  get credentials() {
    return navigator.credentials;
  },

  get connection() {
    return undefined;
  },

  get geolocation() {
    return undefined;
  },

  get mediaDevices() {
    return {
      enumerateDevices: () => Promise.resolve([]),
      getUserMedia: () => Promise.reject(new Error("Permission denied")),
    };
  },

  get serviceWorker() {
    return undefined;
  },

  get storage() {
    return navigator.storage;
  },

  get userActivation() {
    return navigator.userActivation;
  },

  get deprecatedRunAdAuctionEnforcesKAnonymity() {
    return navigator.deprecatedRunAdAuctionEnforcesKAnonymity;
  },

  get plugins() {
    return { length: 0, item: () => null, namedItem: () => null };
  },
  get mimeTypes() {
    return { length: 0, item: () => null, namedItem: () => null };
  },

  get vibrate() {
    return undefined;
  },

  // Gamepads API - empty array
  get gamepads() {
    return navigator.gamepads;
  },

  get userAgentData() {
    return undefined;
  },

  javaEnabled: () => {
    return navigator.javaEnabled();
  },

  get devicePosture() {
    return undefined;
  },
  get keyboard() {
    return undefined;
  },
  get bluetooth() {
    return undefined;
  },
  get usb() {
    return undefined;
  },
  get webkitPersistentStorage() {
    return undefined;
  },
  get webkitTemporaryStorage() {
    return undefined;
  },
  get mediaSession() {
    return undefined;
  },
  get doNotTrack() {
    return navigator.doNotTrack;
  },
  get presentation() {
    return navigator.presentation;
  },
  get webstore() {
    return navigator.webstore;
  },
  get permissions() {
    return {
      query: async () => ({ state: "prompt" }),
      request: async () => true,
      revoke: async () => true,
    };
  },
  get serial() {
    return navigator.serial;
  },
  get clipboard() {
    return navigator.clipboard;
  },
  get storage() {
    return navigator.storage;
  },

  hasOwnProperty(prop) {
    return Object.prototype.hasOwnProperty.call(this, prop);
  },
  toString() {
    return "[object Navigator]";
  },
};

export { $mirr$navigator };
