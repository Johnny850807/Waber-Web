import axios from "axios";
import {Client} from "@stomp/stompjs";

export default class MatchService {

    constructor() {
        this.listenToMatch$ = null;
        this.axios = axios.create({
            baseURL: process.env.REACT_APP_MATCH_SVC_BASE_URL,
            timeout: 5000
        });

        this.client = new Client();
        this.client.brokerURL = process.env.REACT_APP_BROKER_SVC_BASE_URL;
        this.client.activate();
        this.client.onConnect = (frame) => {
            const healthCheck = this.client.subscribe('/topic/health',
                (message) => {
                    console.log(`Websocket broker's Health Check: ${message.body}.`);
                    this.client.unsubscribe(healthCheck.id);
                });
        };
    }

    async startMatching({passengerId, startLocation, carType}) {
        return this.axios.post(`/api/users/${passengerId}/matches`, {
            startLocation, carType
        })
    }

    async getPassengerCurrentMatch({passengerId}) {
        return this.axios.get(`/api/users/${passengerId}/matches/current`);
    }

    async listenToMatch({passengerId, matchId}) {
        if (!this.listenToMatch$) {
            this.listenToMatch$ = new Promise((resolve) => {
                const listening = this.client.subscribe(`/topic/passengers/${passengerId}/matches`, message => {
                    const {passengerId, driverId} = JSON.parse(message.body);
                    resolve({passengerId, driverId});
                    this.client.unsubscribe(listening.id);
                });
            });
        }
        return this.listenToMatch$;
    }


}
