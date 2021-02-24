import './CarHailing.css'
import './main.css'
import React, {useEffect} from "react";
import {storage} from "./localstorage"
import {CAR_TYPES, Location} from "./model/models";
import {matchService, userService} from "./api/services";


function listenToMatchEvent({passengerId, matchId, onMatch}) {
    matchService.listenToMatch(passengerId)
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
                });
        }
    }, [match])

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
            </div>
        </div>
    );
}

