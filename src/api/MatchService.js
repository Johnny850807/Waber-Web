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
        this.client.onConnect =  (frame) => {
            this.client.subscribe('/topic/health', (message) => console.log(message.body));
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
                const taskId = setInterval(() => {
                    this.axios.get(`/api/users/${passengerId}/matches/${matchId}`)
                        .then(res => {
                            const match = res.data;
                            if (match.completed) {
                                resolve(match);
                                clearInterval(taskId);
                            }
                        })
                }, 3000)
            });
        }
        return this.listenToMatch$;
    }


}
