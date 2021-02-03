import './CarHailing.css'
import './main.css'
import React, {useEffect} from "react";
import MatchService from "./api/MatchService";
import {storage} from "./localstorage"
import {Location} from "./model/models";
import {CAR_TYPES} from "./model/models";
import SockJsClient from 'react-stomp';


const matchService = new MatchService();


const TripStatusView = (({match}) => {
    return (
        <div>
            <p>Match Driver: {match.driver.name}</p>
            <p>The driver's location: </p>
        </div>
    );
});

function startMatching({passengerId, startLocation, carType, onMatch}) {
    matchService.startMatching({
        passengerId, startLocation, carType
    }).then(res => {
        console.log(res.data);
        const matchId = res.data.id;
        storage.saveMatchId(matchId)
        listenToMatchEvent({passengerId, matchId, onMatch});
    });
}

function listenToMatchEvent({passengerId, matchId, onMatch}) {
    matchService.listenToMatch({
        passengerId, matchId
    }).then(match => {
        console.log(match.driver.name);
        onMatch(match);
    });
}

const MatchingStatusView = ({matchId, destination}) => {
    const [match, setMatch] = React.useState()
    useEffect(() => {
        console.log(`N ${destination.latitude}, E ${destination.longitude}`);
        if (matchId) {
            listenToMatchEvent({
                passengerId: storage.getUserId(),
                matchId,
                onMatch: m => setMatch(m)
            });
        } else {
            startMatching({
                passengerId: storage.getUserId(),
                startLocation: storage.getUserCurrentLocation(),
                carType: CAR_TYPES.NORMAL,
                onMatch: m => setMatch(m)
            });
        }
    }, [destination.latitude, destination.longitude, match, matchId]);
    return (
        <div className="matchingStatusView mt-3">
            {match ?
                <TripStatusView match={match}/>
                : <p>Matching ...</p>
            }
        </div>
    )
}

export default function CarHailing() {
    let [matching, setMatching] = React.useState(false);
    let [destination, setDestination] = React.useState(storage.getDestination());
    const matchId = storage.getMatchId();

    const startMatching = (e) => {
        e.preventDefault();
        const destination = new Location(parseFloat(e.target[0].value), parseFloat(e.target[1].value));
        setDestination(destination);
        storage.saveDestination(destination);
        setMatching(true);
    }

    useEffect(() => {
        if (matchId) {
            setMatching(true)
        }
    })

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
                    <input type="number" disabled={matching} placeholder="latitude" defaultValue="25.047"/>
                    <input type="number" disabled={matching} placeholder="longitude" defaultValue="121.51"/>
                    <button type="submit" className={matching ? 'disabled' : ''}>Go!</button>
                </form>
                {matching ? <MatchingStatusView matchId={matchId} destination={destination}/> : null}
            </div>
        </div>
    );
}

