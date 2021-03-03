const CAR_TYPES = {
    NORMAL: 'Normal',
    BUSINESS: 'Business',
    SPORT: 'Sport'
}

class User {
    constructor({id, name}) {
        this.id = id;
        this.name = name;
    }
}

class Match {
    constructor({id, passengerId, driver, completed, matchPreferences, createdDate}) {
        this.id = id;
        this.passengerId = passengerId;
        this.completed = completed;
        this.driver = new User(driver);
        this.matchPreferences = new MatchPreferences(matchPreferences);
        this.createdDate = new Date(createdDate);
    }
}

class MatchPreferences {
    constructor({startLocation, carType, activityName}) {
        this.carType = carType;
        this.activityName = activityName;
        this.startLocation = new Location(startLocation.latitude, startLocation.longitude);

    }

}

class Location {
    constructor(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    toString() {
        return `${this.latitude},${this.longitude}`
    }

    static fromString(str) {
        const [latitude, longitude] = str.split(",");
        return new Location(parseFloat(latitude), parseFloat(longitude));
    }
}


const TRIP_STATE = {
    Start: 'START', Driving: 'DRIVING', Arrived: 'ARRIVED'
};

export {CAR_TYPES, User, Location, Match, TRIP_STATE};
