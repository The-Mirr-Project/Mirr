// yes 
import { BareClient } from "@mercuryworkshop/bare-mux";

function patchWebSocket() {
    const client = new BareClient();
    const originalCreate = client.createWebSocket.bind(client);

    window.WebSocket = function(url, protocols) {
        return originalCreate(url, protocols);
    };

    // copy static constants
    Object.keys(WebSocket).forEach(k => window.WebSocket[k] = WebSocket[k]);
}


export { patchWebSocket };