import axios from "axios";
const Stomp = require('stompjs');


export default class MatchService {
    listenToMatch$;

    constructor() {
        this.axios = axios.create({
            baseURL: process.env.REACT_APP_MATCH_SVC_BASE_URL,
            timeout: 5000
        });
    }

    async startMatching({passengerId, startLocation, carType}) {
        return this.axios.post(`/api/users/${passengerId}/matches`, {
            startLocation, carType
        })
    }

    async getPassengerMatch({passengerId}) {
        return this.axios.get(`/api/users/${passengerId}/matches/current}`);
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
