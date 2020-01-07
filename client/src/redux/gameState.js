import { createStore, applyMiddleware } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
let socket = io('http://localhost:3001');
let matchmakingMiddleware = createSocketIoMiddleware(socket, "matchmaking/");
let gameMiddleware = createSocketIoMiddleware(socket, "game/");

export const SOCKET_START_MATCHMAKING = "matchmaking/START_MATCHMAKING";
export const SOCKET_REPLY_MATCHUP = "matchmaking/REPLY_MATCHUP";

export const CLIENT_REGISTER = "client/REGISTER";
export const CLIENT_PROPOSE_MATCHUP = "client/PROPOSE_MATCHUP";
export const CLIENT_START_GAME = "client/START_GAME";

export const GAME_REQUEST_SESSION = "game/REQUEST_GAME_SESSION";
export const GAME_PLAYER_READY = "game/PLAYER_READY";

const initialState = {
    userType: "guest",
    gameState: "default",
    socketId: "none",
    gameId: "none",
    opponent: "none",
    game: {

    }
}

function reducer(state = initialState, action) {
    switch (action.type) {

        // actions prefixed with SOCKET also trigger gerneral client-server actions on socket
        case SOCKET_START_MATCHMAKING:
            return { ...state, gameState: "matchmaking", game: action.payload };
        case SOCKET_REPLY_MATCHUP:
            return state;

        // actions prefixed with CLIENT result only in a client-side stage change
        case CLIENT_REGISTER:
            return { ...state, socketId: action.payload };
        case CLIENT_PROPOSE_MATCHUP:
            return { ...state, gameState: "proposal", opponent: action.payload }
        case CLIENT_START_GAME:
            return { ...state, gameState: "initiateGame", game: action.payload }

        // actions prefixed with GAME also trigger game-related client-server actions on socket
        case GAME_PLAYER_READY:
            return { ...state, gameState: "ongoing"}
        default:
            console.log(action);
            return state;
    }

}

let gameState = applyMiddleware(matchmakingMiddleware, gameMiddleware)(createStore)(reducer);

export default gameState;
