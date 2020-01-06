import { createStore, applyMiddleware } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
let socket = io('http://localhost:3001');
let socketIoMiddleware = createSocketIoMiddleware(socket, "matchmaking/");

export const SOCKET_START_MATCHMAKING = "matchmaking/START_MATCHMAKING";

export const CLIENT_REGISTER = "client/REGISTER";

const initialState = {
    gameState: "guest",
    socketId: "none",
    game: "none"
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case SOCKET_START_MATCHMAKING:
            return { ...state, gameState: "matchmaking", game: action.payload };
        case CLIENT_REGISTER:
            return {...state, socketId:action.data};
        default:
            console.log(action);
            return state;
    }

}

let gameState = applyMiddleware(socketIoMiddleware)(createStore)(reducer);

export default gameState;
