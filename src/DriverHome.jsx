import React, {useEffect} from "react";
import {CAR_TYPES, Location, Match, TRIP_STATE} from "./model/models";
import {matchService, tripService, userService} from "./api/services";
import {storage} from "./localstorage";
import {Switch} from "./utils";



export default function DriverHome() {
    const [match, setMatch] = React.useState();
    const [tripState, setTripState] = React.useState();
    const [updatingLocation, setUpdatingLocation] = React.useState(false);
    const driverId = storage.getUserId();

    useEffect(() => {
        if (!match) {
            matchService.subscribeToMatchCompletion(driverId)
                .then(({passengerId, driverId}) => {
                    console.log(`Match driver (${driverId}) to passenger (${passengerId})`);
                    matchService.getUserCurrentMatch(driverId)
                        .then(res => {
                            setMatch(new Match(res.data));
                            setTripState(TRIP_STATE.Start);
                        });
                });
            matchService.getUserCurrentMatch(driverId)
                .then(res => {
                    setMatch(new Match(res.data));
                    setTripState(TRIP_STATE.Start);
                });
        }
        if (!tripState) {
            tripService.getCurrentTrip(driverId)
                .then(res => setTripState(res.data.state));
        }
    }, [match, tripState])

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

    const pickupPassenger = () => {
        tripService.startDriving(match.passengerId, new Location(200, 200) /*TODO: hard-coded destination*/)
            .then(res => {
                console.log('Trip: Start Driving');
                setTripState(TRIP_STATE.Driving);
            })
    }

    const arriveDestination = () => {
        tripService.arriveDestination(match.passengerId)
            .then(res => {
                console.log('Trip: Arrived');
                setTripState(TRIP_STATE.Arrived);
            })
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
                            <Switch test={tripState}>
                                <div value={TRIP_STATE.Start}>
                                    <p>Picking up the passenger ...</p>
                                    <button onClick={pickupPassenger} className="mt-4">Pick Up the Passenger</button>
                                </div>
                                <div value={TRIP_STATE.Driving}>
                                    <p>Driving to the destination ...</p>
                                    <button onClick={arriveDestination} className="mt-4">Arrive Destination</button>                                </div>
                                <div value={TRIP_STATE.Arrived}>
                                    <p>Arrived</p>
                                </div>
                            </Switch>
                        </div>
                    ) : <p>No Match</p> }

                </div>
            </div>
        </div>

    )
}
