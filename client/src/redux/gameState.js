import { createStore, applyMiddleware } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import logger from 'redux-logger'


function optimisticExecute(action, emit, next, dispatch) {
    emit('action', action);
    console.log(action);
    next(action);
}

let socket = io('http://localhost:3001');
let socketMiddleware = createSocketIoMiddleware(socket, ["matchmaking/", "game/"]);

export const SOCKET_START_MATCHMAKING = "matchmaking/START_MATCHMAKING";
export const SOCKET_REPLY_MATCHUP = "matchmaking/REPLY_MATCHUP";

export const CLIENT_REGISTER = "client/REGISTER";
export const CLIENT_PROPOSE_MATCHUP = "client/PROPOSE_MATCHUP";
export const CLIENT_START_GAME = "client/START_GAME";
export const CLIENT_UPDATE_GAME = "client/UPDATE_GAME";

export const GAME_REQUEST_SESSION = "game/REQUEST_GAME_SESSION";
export const GAME_PLAYER_READY = "game/PLAYER_READY";
export const GAME_PLAYER_MOVE = "game/PLAYER_MOVE"
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

        // actions prefixed with SOCKET are used to trigger gerneral client-server actions on socket
        case SOCKET_START_MATCHMAKING:
            return { ...state, gameState: "matchmaking", game: action.payload };
        case SOCKET_REPLY_MATCHUP:
            return state;

        // actions prefixed with CLIENT result only in a client-side stage change that's triggered by the server
        case CLIENT_REGISTER:
            return { ...state, socketId: action.payload };
        case CLIENT_PROPOSE_MATCHUP:
            return { ...state, gameState: "proposal", opponent: action.payload }
        case CLIENT_START_GAME:
            return { ...state, gameState: "initiateGame", game: action.payload }
        case CLIENT_UPDATE_GAME:
            console.log(action.payload.game)
            console.log(action.payload.move)
            return { ...state, game: action.payload.game, move:action.payload.move }

        // actions prefixed with GAME are used to trigger game-related client-server actions on socket
        case GAME_PLAYER_READY:
            return { ...state, gameState: "ongoing" }
        case GAME_PLAYER_MOVE:
            return state;


        // for actions with no server side-effects use mobx;
        default:
            console.log(action);
            return state;
    }

}

let gameState = applyMiddleware(socketMiddleware)(createStore)(reducer);

export default gameState;
