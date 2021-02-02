import axios from "axios";


export default class MatchService {

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

    async listenToMatch({passengerId, matchId}) {
        return new Promise((resolve) => {
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

}
