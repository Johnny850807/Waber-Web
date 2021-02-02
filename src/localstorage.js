import {Location} from "./model/models";

const KEY_USER_ID = "userid";
const KEY_MATCH_ID = "matchId";
const KEY_CURRENT_LOCATION = "currentLocation";

const KEY_DESTINATION = "destination";

class LocalStorage {
    saveUserId(userId) {
        return localStorage.setItem(KEY_USER_ID, userId);
    }

    getUserId() {
        return localStorage.getItem(KEY_USER_ID);
    }

    saveMatchId(matchId) {
        localStorage.setItem(KEY_MATCH_ID, matchId);
    }

    getMatchId() {
        return localStorage.getItem(KEY_MATCH_ID);
    }

    removeMatchId() {
        localStorage.removeItem(KEY_MATCH_ID);
    }

    saveUserCurrentLocation(location) {
        localStorage.setItem(KEY_CURRENT_LOCATION, location.toString());
    }

    getUserCurrentLocation() {
        const val = localStorage.getItem(KEY_CURRENT_LOCATION);
        return val ? Location.fromString(val) : new Location(0, 0);
    }

    saveDestination(location) {
        localStorage.setItem(KEY_DESTINATION, location.toString());
    }

    getDestination() {
        const val = localStorage.getItem(KEY_DESTINATION);
        return val ? Location.fromString(val) : new Location(0, 0);
    }

    removeDestination() {
        localStorage.removeItem(KEY_DESTINATION);
    }
}

export const storage = new LocalStorage();

