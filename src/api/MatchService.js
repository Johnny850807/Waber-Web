import axios from "axios";

export default class MatchService {
    constructor(stompClient) {
        this.listenToMatch$ = null;
        this.axios = axios.create({
            baseURL: process.env.REACT_APP_MATCH_SVC_BASE_URL,
            timeout: 5000
        });
        this.stompClient = stompClient;
    }

    async startMatching({passengerId, startLocation, carType}) {
        return this.axios.post(`/api/users/${passengerId}/matches`, {
            startLocation, carType
        })
    }

    async getUserCurrentMatch(userId) {
        return this.axios.get(`/api/users/${userId}/matches/current`);
    }

    async listenToMatch(userId) {
        if (!this.listenToMatch$) {
            this.listenToMatch$ = new Promise((resolve) => {
                const subscription = this.stompClient.subscribe(`/topic/users/${userId}/matches`, message => {
                    const {passengerId, driverId} = JSON.parse(message.body);
                    resolve({passengerId, driverId});
                    subscription.unsubscribe();
                });
            });
        }
        return this.listenToMatch$;
    }


}
