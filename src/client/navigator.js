// yoinked from the tor browser
const $mirr$navigator = {
  get appCodeName() {
    return "Mozilla";
  },
  get appName() {
    return "Netscape";
  },
  get appVersion() {
    return "5.0 (Windows NT 10.0; rv:115.0)";
  },
  get userAgent() {
    return "Mozilla/5.0 (Windows NT 10.0; rv:115.0) Gecko/20100101 Firefox/115.0";
  },
  get platform() {
    return "Win32";
  },
  get product() {
    return "Gecko";
  },
  get productSub() {
    return "20100101";
  },
  get vendor() {
    return "";
  },
  get vendorSub() {
    return "";
  },

  get language() {
    return "en-US";
  },
  get languages() {
    return ["en-US", "en"];
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
    return false;
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
    return [];
  },

  get userAgentData() {
    return undefined;
  },

  javaEnabled() {
    return false;
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
    return "1";
  },
  get presentation() {
    return undefined;
  },
  get webstore() {
    return undefined;
  },
  get permissions() {
    return {
      query: async () => ({ state: "prompt" }),
      request: async () => true,
      revoke: async () => true,
    };
  },
  get serial() {
    return undefined;
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
