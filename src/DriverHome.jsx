import React from "react";


const MatchStatusView = () => {
    const [match, setMatch] = React.useState();

    return (
        <div className="py-3">
            {match ? (
                <div>
                    <p>Match Passenger</p>
                    <p>Start Location: match.startLocation</p>
                </div>
            ) : <p>No Match</p>
            }

        </div>
    );
}

export default function DriverHome() {
    return (
        <div className="page">
            <div className="panel">
                <p className="mb-2">Driver Home</p>
                <form onSubmit="">
                    <input type="number" placeholder="latitude" defaultValue="25.047"/>
                    <input type="number" placeholder="longitude" defaultValue="121.51"/>
                    <button type="submit">Update Location</button>
                </form>
                <MatchStatusView/>
            </div>
        </div>

    )
}
