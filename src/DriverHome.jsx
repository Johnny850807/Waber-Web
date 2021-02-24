import React, {useEffect} from "react";
import {CAR_TYPES, Location, Match} from "./model/models";
import {matchService, userService} from "./api/services";
import {storage} from "./localstorage";


export default function DriverHome() {
    const [match, setMatch] = React.useState();
    const [updatingLocation, setUpdatingLocation] = React.useState(false);
    const driverId = storage.getUserId();

    useEffect(() => {
        if (!match) {
            matchService.listenToMatch(driverId)
                .then(({passengerId, driverId}) => {
                    console.log(`Match driver (${driverId}) to passenger (${passengerId})`);
                    matchService.getUserCurrentMatch(driverId)
                        .then(res => setMatch(new Match(res.data)));
                });
            matchService.getUserCurrentMatch(driverId)
                .then(res => setMatch(new Match(res.data)));
        }
    }, [match])

    const updateLocation = (e) => {
        e.preventDefault();
        const location = new Location(parseFloat(e.target[0].value), parseFloat(e.target[1].value));
        setUpdatingLocation(true);
        userService.updateLocation({userId: driverId, ...location})
            .then(() => {
                setUpdatingLocation(false);
                console.log(`Update location successfully.`);
            });
    }

    const startTheTrip = () => {

    }

    return (
        <div className="page">
            <div className="panel">
                <p className="mb-2">Driver Home</p>
                <form onSubmit={updateLocation}>
                    <input type="number" placeholder="latitude" defaultValue="25.047"/>
                    <input type="number" placeholder="longitude" defaultValue="121.51"/>
                    <button type="submit" className={updatingLocation ? 'disabled' : ''}>Update Location</button>
                </form>
                <div className="py-3">
                    {match ? (
                        <div>
                            <p>Match Passenger</p>
                            <p>Start Location: {match?.matchPreferences.startLocation.toString()}</p>
                            <button onClick={startTheTrip} className="mt-4">Start the Trip</button>
                        </div>
                    ) : <p>No Match</p> }

                </div>
            </div>
        </div>

    )
}
