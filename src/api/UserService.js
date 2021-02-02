import axios from "axios";

const TYPE_DRIVER = 'driver'
const TYPE_PASSENGER = 'passenger'

class UserService {
    constructor() {
        this.axios = axios.create({
            baseURL: process.env.REACT_APP_USER_SVC_BASE_URL,
            timeout: 5000
        });
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
}


export {TYPE_PASSENGER, TYPE_DRIVER, UserService}
