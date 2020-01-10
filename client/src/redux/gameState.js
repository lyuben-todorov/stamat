import { createStore, applyMiddleware } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';



let socket = io('http://localhost:3001');
let socketMiddleware = createSocketIoMiddleware(socket, ["server/", "game/"]);

export const SERVER_START_MATCHMAKING = "server/START_MATCHMAKING";
export const SERVER_REPLY_MATCHUP = "server/REPLY_MATCHUP";
export const SERVER_REGISTER_USER = "server/REGISTER_USER"

export const CLIENT_REGISTER_USER = "client/REGISTER_USER";
export const CLIENT_PROPOSE_MATCHUP = "client/PROPOSE_MATCHUP";
export const CLIENT_START_GAME = "client/START_GAME";
export const CLIENT_UPDATE_GAME = "client/UPDATE_GAME";

export const GAME_REQUEST_SESSION = "game/REQUEST_GAME_SESSION"; //not implemented
export const GAME_PLAYER_READY = "game/PLAYER_READY";
export const GAME_PLAYER_MOVE = "game/PLAYER_MOVE"
const initialState = {
    userType: "guest",
    gameState: "default",
    socketId: "none",
    sessionId:"none",
    username: "none",
    gameId: "none",
    opponentId: "none",
    game: {

    },
    history: []
}

function reducer(state = initialState, action) {
    switch (action.type) {

        // actions prefixed with SERVER are triggered by the CLIENT for gerneral client-server actions on socket

        // requests a sessionId from the server
        // good idea to trigger this after login or after guest
        // takes {username:"", guest:true}
        case SERVER_REGISTER_USER:
            break;
        case SERVER_START_MATCHMAKING:
            return { ...state, gameState: "matchmaking", game: action.payload, username: action.username };
        case SERVER_REPLY_MATCHUP:
            return state;
        

        // actions prefixed with CLIENT are triggered by the SERVER for general client state updates

        // client register is issued by the server after socket connects
        // sessionId is unique per user for both guests and registered clients
        // used to identify user session
        case CLIENT_REGISTER_USER:
            return { ...state, socketId: action.payload };
        case CLIENT_PROPOSE_MATCHUP:
            return { ...state, gameState: "proposal", opponentId: action.payload }
        case CLIENT_START_GAME:
            return { ...state, gameState: "initiateGame", game: action.payload }
        case CLIENT_UPDATE_GAME:
            return { ...state, game: action.payload.game, move: action.payload.move, history: action.payload.game.history }

        // actions prefixed with GAME are triggered by the SERVER for game-related actions on socket
        case GAME_PLAYER_READY:
            return { ...state, gameState: "ongoing" }
        case GAME_PLAYER_MOVE:
            return { ...state, history: action.payload.game.history };


        // for actions with no server side-effects use mobx;
        default:
            console.log(action);
            return state;
    }

}

let gameState = applyMiddleware(socketMiddleware)(createStore)(reducer);

export default gameState;
