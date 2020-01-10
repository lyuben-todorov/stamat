
import { SERVER_REGISTER_USER, SERVER_START_MATCHMAKING, SERVER_REPLY_MATCHUP, CLIENT_REGISTER_USER, CLIENT_PROPOSE_MATCHUP, CLIENT_START_GAME, CLIENT_UPDATE_GAME, GAME_PLAYER_READY, GAME_PLAYER_MOVE } from '../actions';


const initialState = {
    userType: "guest",
    gameState: "default",
    sessionId: "none",
    username: "none",
    opponentName: "none",
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
            return { ...state, gameState: "proposal", opponentId: action.payload }
        case CLIENT_START_GAME:
            console.log("KUUUUUUUR");

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


export default reducer;
