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

export const GAME_START_GAME = "game/START_GAME";

const initialState = {
    gameState: "guest",
    socketId: "none",
    gameId: "none",
    opponent: "none",
    game:{

    }
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case SOCKET_START_MATCHMAKING:
            return { ...state, gameState: "matchmaking", game: action.payload };
        case CLIENT_REGISTER:
            return { ...state, socketId: action.payload };
        case CLIENT_PROPOSE_MATCHUP:
            return { ...state, gameState: "proposal", opponent: action.payload }
        case SOCKET_REPLY_MATCHUP:
            return state;
        case CLIENT_START_GAME:
            return { ...state, gameState: "game", gameId: action.payload }
        default:
            console.log(action);
            return state;
    }

}

let gameState = applyMiddleware(matchmakingMiddleware, gameMiddleware)(createStore)(reducer);

export default gameState;
