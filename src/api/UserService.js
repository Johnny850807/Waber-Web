import axios from "axios";
import {Location} from "../model/models";

const TYPE_DRIVER = 'driver'
const TYPE_PASSENGER = 'passenger'

class UserService {
    constructor(stompClient) {
        this.driverLocationSubscriptions = {};  // <driverId, promise>
        this.axios = axios.create({
            baseURL: process.env.REACT_APP_USER_SVC_BASE_URL,
            timeout: 5000
        });
        this.stompClient = stompClient;
    }

    async login({email, password}) {
        console.log(`login: ${email}`);
        return await this.axios.post('/api/users/signIn', {email, password});
    }

    async signUpAsPassenger({name, email, password}) {
        console.log('signUpAsPassenger');
        return await this.axios.post('/api/passengers', {
            name, email, password
        });
    }

    async signUpAsDriver({name, email, password, carType}) {
        console.log('signUpAsDriver');
        return await this.axios.post('/api/drivers', {
            name, email, password, carType
        });
    }

    async updateLocation({userId, latitude, longitude}) {
        console.log(`Update Location: N ${latitude}, E ${longitude}`);
        return await this.axios.put(`/api/users/${userId}/location`, null, {
            params: {latitude, longitude}
        })
    }

    subscribeToDriverLocation(driverId, onNext) {
        if (!this.driverLocationSubscriptions[driverId]) {
            this.driverLocationSubscriptions[driverId] = this.stompClient.subscribe(`/topic/users/${driverId}/location`, message => {
                const event = JSON.parse(message.body);
                const {latitude, longitude} = event.location;
                onNext(new Location(latitude, longitude));
            });
        }
        return this.driverLocationSubscriptions[driverId];
    }
}


export {TYPE_PASSENGER, TYPE_DRIVER, UserService}
