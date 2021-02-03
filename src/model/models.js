const CAR_TYPES = {
    NORMAL: 'Normal',
    BUSINESS: 'Business',
    SPORT: 'Sport'
}

class Match {
    constructor({id, startLocation, driverId, driverName, matchPreferences}) {
        this.id = id;
        this.startLocation = startLocation;
        this.driverId = driverId;
        this.driverName = driverName;
        this.matchPreferences = matchPreferences;
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


export {CAR_TYPES, Location};
