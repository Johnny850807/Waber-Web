import './CarHailing.css'
import './main.css'
import React, {useEffect} from "react";
import {storage} from "./localstorage"
import {CAR_TYPES, Location, TRIP_STATE} from "./model/models";
import {matchService, tripService, userService} from "./api/services";
import {Switch} from "./utils";


function listenToMatchEvent({passengerId, matchId, onMatch}) {
    matchService.subscribeToMatchCompletion(passengerId)
        .then(({passengerId, driverId}) => {
            console.log(`Match passenger (${passengerId}) to driver (${driverId})`);
            matchService.getUserCurrentMatch(passengerId)
                .then(res => onMatch(res.data));
        });
}


export default function CarHailing() {
    const passengerId = storage.getUserId();
    const [match, setMatch] = React.useState();
    const [driverLocation, setDriverLocation] = React.useState();
    const [tripState, setTripState] = React.useState();

    useEffect(() => {
        if (match) {
            if (!match.completed) {
                console.log("Listening for matching...");
                listenToMatchEvent({
                    passengerId,
                    matchId: match.id,
                    onMatch: match => {
                        setMatch(match);
                        userService.subscribeToDriverLocation(match.driver.id, location => {
                            setDriverLocation(location);
                        });
                        tripService.subscribeToTripStateChange(passengerId, state => setTripState(state));
                    }
                });
            }
        } else {
            matchService.getUserCurrentMatch(passengerId)
                .then(res => {
                    const match = res.data;
                    setMatch(match);
                    userService.subscribeToDriverLocation(match.driver.id, location => {
                        setDriverLocation(location);
                    });
                    tripService.subscribeToTripStateChange(passengerId, state => setTripState(state));
                });
        }

        if (!tripState) {
            tripService.getCurrentTrip(passengerId)
                .then(res => setTripState(res.data.state));
        }
    }, [match, tripState])

    const startMatching = (e) => {
        e.preventDefault();
        // TODO: the destination is not used temporarily
        const destination = new Location(parseFloat(e.target[0].value), parseFloat(e.target[1].value));
        matchService.startMatching({
            passengerId,
            startLocation: storage.getUserCurrentLocation(),
            carType: CAR_TYPES.NORMAL  // TODO: hard-coded for a while
        }).then(res => {
            console.log(res.data);
            const match = res.data;
            setMatch(match);
            tripService.subscribeToTripStateChange(passengerId, state => setTripState(state));
        });
    }

    return (
        <div className="page">
            <div className="panel py-4">
                <section className="hero is-link mb-2">
                    <div className="hero-body">
                        <p className="title">
                            Hi
                        </p>
                        <p className="subtitle">
                            Where are you going to go?
                        </p>
                    </div>
                </section>
                <form onSubmit={startMatching}>
                    <input type="number" disabled={match} placeholder="latitude" defaultValue="25.047"/>
                    <input type="number" disabled={match} placeholder="longitude" defaultValue="121.51"/>
                    <button type="submit" className={match ? 'disabled' : ''}>Go!</button>
                </form>
                {match ? (
                    <div className="matchingStatusView mt-3">
                        {match.completed ? (
                            <div>
                                <p>Match Driver: {match.driver.name}</p>
                                <p>The driver's location: {driverLocation?.toString()}</p>
                            </div>
                        ) : <p>Matching ...</p>
                        }
                    </div>
                ) : null}
                {tripState ? (
                    <div>
                        <Switch test={tripState}>
                            <p value={TRIP_STATE.Start}>
                                The driver is coming...
                            </p>
                            <p value={TRIP_STATE.Driving}>
                                Driving to the destination ...
                            </p>
                            <p value={TRIP_STATE.Arrived}>
                                You have arrived the destination.
                            </p>
                        </Switch>
                    </div>
                ): null}
            </div>
        </div>
    );
}

