importScripts("sw.bundle.js")

self.addEventListener("fetch", (event) => {
    event.respondWith(
        handleRequest(event.request)
    );
});
