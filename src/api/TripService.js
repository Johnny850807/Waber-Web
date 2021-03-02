import axios from "axios";


export default class TripService {
    constructor(stompClient) {
        this.axios = axios.create({
            baseURL: process.env.REACT_APP_TRIP_SVC_BASE_URL,
            timeout: 5000
        });
        this.stompClient = stompClient;
    }

    startDriving(passengerId, destination) {
        return this.axios.patch(`/api/users/${passengerId}/trips/current/startDriving`, destination);
    }

    arriveDestination(passengerId) {
        return this.axios.patch(`/api/users/${passengerId}/trips/current/arrive`);
    }
}
