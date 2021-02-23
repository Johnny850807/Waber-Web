import './CarHailing.css'
import './main.css'
import React, {useEffect} from "react";
import MatchService from "./api/MatchService";
import {storage} from "./localstorage"
import {Location} from "./model/models";
import {CAR_TYPES} from "./model/models";

const matchService = new MatchService();


function listenToMatchEvent({passengerId, matchId, onMatch}) {
    matchService.listenToMatch({
        passengerId, matchId
    }).then(({passengerId, driverId}) => {
        console.log(`Match passenger (${passengerId}) to driver (${driverId})`);
        matchService.getPassengerCurrentMatch({passengerId})
            .then(res => onMatch(res.data));
    });
}

export default function CarHailing() {
    const passengerId = storage.getUserId();
    const [match, setMatch] = React.useState();

    useEffect(() => {
        if (match) {
            if (!match.completed) {
                console.log("Listening for matching...");
                listenToMatchEvent({
                    passengerId,
                    matchId: match.id,
                    onMatch: match => setMatch(match)
                });
            }
        } else {
            matchService.getPassengerCurrentMatch({passengerId})
                .then(res => setMatch(res.data));
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
                                <p>The driver's location: </p>
                            </div>
                        ) : <p>Matching ...</p>
                        }
                    </div>
                ) : null}
            </div>
        </div>
    );
}

