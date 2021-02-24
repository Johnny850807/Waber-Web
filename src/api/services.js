import {UserService} from "./UserService";
import MatchService from "./MatchService";
import StompClient from "./StompClient";


const stompClient = new StompClient();

const userService = new UserService(stompClient);
const matchService = new MatchService(stompClient);

stompClient.connect();

export {userService, matchService, stompClient}
