
import {CLIENT_CONTINUE_GAME, SERVER_REGISTER_USER, SERVER_START_MATCHMAKING, SERVER_REPLY_MATCHUP, CLIENT_REGISTER_USER, CLIENT_PROPOSE_MATCHUP, CLIENT_START_GAME, CLIENT_UPDATE_GAME, GAME_PLAYER_READY, GAME_PLAYER_MOVE } from '../actions';


const initialState = {
    userType: "user",
    gameState: "default",
    sessionId: "none",
    username: "none",
    opponentName: "None",
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
            return { ...state, sessionId: action.payload.sessionId, username: action.payload.username };
        case SERVER_START_MATCHMAKING:
            return { ...state, gameState: "matchmaking" };
        case SERVER_REPLY_MATCHUP:
            return state;


        // actions prefixed with CLIENT are triggered by the SERVER for general client state updates

        // client register is issued by the server after socket connects
        // sessionId is unique per user for both guests and registered clients
        // used to identify user session
        case CLIENT_REGISTER_USER:
            return { ...state };
        case CLIENT_PROPOSE_MATCHUP:
            return { ...state, gameState: "proposal", opponentId: action.payload.sessionId, opponentName: action.payload.username }
        case CLIENT_START_GAME:
            return { ...state, gameState: "initiateGame", game: action.payload.game, history:[] }
        case CLIENT_CONTINUE_GAME:
            return { ...state, gameState: "initiateGame", game: action.payload.game, history:action.payload.history }
        case CLIENT_UPDATE_GAME:
            return { ...state, move: action.payload.move, history: [...state.history, action.payload.move] }


        // actions prefixed with GAME are triggered by the CLIENT for game-related actions on socket
        case GAME_PLAYER_READY:
            return { ...state, gameState: "ongoing" }
        case GAME_PLAYER_MOVE:
            return { ...state, history: [...state.history, action.payload.move] };


        // for actions with no server side-effects use mobx;
        default:
            return state;
    }

}


export default reducer;
