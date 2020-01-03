import { createStore, applyMiddleware } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
let socket = io('http://localhost:3001');
let socketIoMiddleware = createSocketIoMiddleware(socket, "matchmaking/");

export const START_MATCHMAKING = "matchmaking/START_MATCHMAKING";

const initialState = {
    gameState: "guest",
    game: "none"
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case START_MATCHMAKING:
            return { ...state, gameState: "matchmaking", game: action.payload };
        default:
            return state;
    }
    
}

let gameState = applyMiddleware(socketIoMiddleware)(createStore)(reducer);

export default gameState;
