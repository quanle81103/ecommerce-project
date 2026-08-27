import { Client } from "@stomp/stompjs";

let client = null;

export function connect({ onConnected, onDisconnected, onError } = {}) {
    if (client?.active) return client;
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const defaultSocketUrl = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws`;
    const socketUrl = import.meta.env.VITE_WS_URL
        || (apiUrl ? apiUrl.replace(/\/api\/v1\/?$/, "/ws").replace(/^http/, "ws") : defaultSocketUrl);
    client = new Client({
        brokerURL: socketUrl,
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        connectHeaders: { Authorization: "Bearer " + localStorage.getItem("Token") },
        onConnect: () => onConnected?.(),
        onDisconnect: () => onDisconnected?.(),
        onWebSocketClose: () => onDisconnected?.(),
        onStompError: (frame) => onError?.(frame)
    });
    client.activate();
    return client;
}

export function disconnect() {
    const activeClient = client;
    client = null;
    return activeClient?.deactivate();
}

export function getClient() {
    return client;
}
