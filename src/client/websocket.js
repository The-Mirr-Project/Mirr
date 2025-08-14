function patchWebSocket() {
    const ogSocket = window.WebSocket;

    class patched extends ogSocket {
        constructor(url, protocols) {
            const newUrl = $mirr.prefix + url
            
            super(newUrl, protocols)
        }
    }

    window.WebSocket = patched;
}

export { patchWebSocket };