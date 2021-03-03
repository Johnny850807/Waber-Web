import axios from "axios";

export default class MatchService {
    constructor(stompClient) {
        this.matchCompletion$ = null;
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

    // TODO: use RxJs
    async subscribeToMatchCompletion(userId) {
        if (!this.matchCompletion$) {
            const service = this;
            this.matchCompletion$ = new Promise((resolve) => {
                console.log(`Subscribe to matchCompletion (userId=${userId}).`);
                const subscription = this.stompClient.subscribe(`/topic/users/${userId}/matches`, message => {
                    const {passengerId, driverId} = JSON.parse(message.body);
                    service.matchCompletion$ = undefined;
                    resolve({passengerId, driverId});
                    subscription.unsubscribe();
                });
            });
        }
        return this.matchCompletion$;
    }

}
