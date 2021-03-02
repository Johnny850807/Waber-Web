import {UserService} from "./UserService";
import MatchService from "./MatchService";
import StompClient from "./StompClient";
import TripService from "./TripService";


const stompClient = new StompClient();

const userService = new UserService(stompClient);
const matchService = new MatchService(stompClient);
const tripService = new TripService(stompClient);

stompClient.connect();

export {userService, matchService, tripService, stompClient}
