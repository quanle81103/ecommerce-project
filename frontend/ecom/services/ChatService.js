import { Client } from "@stomp/stompjs";

let client = null;

export function connect(onConnected) {
    client = new Client({
        brokerURL: "http://13.212.248.63:8080/ws",

        connectHeaders: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`
        },

        onConnect: () => {
            console.log("Connected");
            onConnected();
        },

        onStompError: (frame) => {
            console.log('Additional details: ' + frame.body);
            console.log('Broker reported error: ' + frame.headers['message']);
        }
    });

    client.activate();
}

export function disconnect() {
    client?.deactivate();
}

export function getClient() {
    return client;
}