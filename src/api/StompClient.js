import {Client} from "@stomp/stompjs";


export default class StompClient {
    constructor() {
        this.onConnectListeners = []
        this.stompClientImpl = null;
    }

    onConnect(onConnectListener) {
        this.onConnectListeners.push(onConnectListener);
    }

    connect() {
        this.stompClientImpl = new Client();
        this.stompClientImpl.brokerURL = process.env.REACT_APP_BROKER_SVC_BASE_URL;
        this.stompClientImpl.onConnect = (frame) => {
            console.log("WebSocket connected.")
            const healthCheck = this.stompClientImpl.subscribe('/topic/health',
                (message) => {
                    console.log(`Websocket broker's Health Check: ${message.body}.`);
                    this.stompClientImpl.unsubscribe(healthCheck.id);
                });
            this.onConnectListeners.forEach(l => l(frame));
        };
        this.stompClientImpl.activate();
    }

    subscribe(destination, subscriber) {
        let subscriberId;
        if (this.isConnected()) {
            subscriberId = this.stompClientImpl.subscribe(destination, subscriber);
        } else {
            this.onConnect(() => {
                subscriberId = this.stompClientImpl.subscribe(destination, subscriber);
            });
        }

        return new Subscription(subscriberId, this.stompClientImpl);
    }

    unsubscribe(subscriberId) {
        this.stompClientImpl.unsubscribe(subscriberId);
    }

    disconnect() {
        this.stompClientImpl?.disconnect();
    }

    isConnected() {
        return this.stompClientImpl?.connected;
    }
}


class Subscription {
    constructor(id, client) {
        this.id = id;
        this.client = client;
        this.canceled = false;
    }

    unsubscribe() {
        this.client.unsubscribe(this.id)
        this.canceled = true;
    }

    isCanceled() {
        return this.canceled;
    }

    isAlive() {
        return !this.canceled;
    }
}
