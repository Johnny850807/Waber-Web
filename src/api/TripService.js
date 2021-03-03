import axios from "axios";


export default class TripService {
    constructor(stompClient) {
        this.tripStateChange$ = {};
        this.axios = axios.create({
            baseURL: process.env.REACT_APP_TRIP_SVC_BASE_URL,
            timeout: 5000
        });
        this.stompClient = stompClient;
    }

    getCurrentTrip(userId) {
        return this.axios.get(`/api/users/${userId}/trips/current`);
    }

    startDriving(passengerId, destination) {
        return this.axios.patch(`/api/users/${passengerId}/trips/current/startDriving`, destination);
    }

    arriveDestination(passengerId) {
        return this.axios.patch(`/api/users/${passengerId}/trips/current/arrive`);
    }

    // TODO: use RxJs
    subscribeToTripStateChange(passengerId, onChange) {
        if (!this.tripStateChange$[passengerId]?.isAlive()) {
            console.log(`Subscribe to TripStateChange (passengerId=${passengerId})`);
            this.tripStateChange$[passengerId] = this.stompClient.subscribe(`/topic/users/${passengerId}/trips/current/state`, message => {
                const state = message.body;
                console.log(`Trip's State changed: ${state}.`)
                onChange(state);
            });
        }
        return this.tripStateChange$[passengerId];
    }
}
