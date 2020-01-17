
import { CLIENT_RESUME_SESSION, CLIENT_RESUME_GAME, SERVER_REGISTER_USER, SERVER_START_MATCHMAKING, SERVER_REPLY_MATCHUP, CLIENT_REGISTER_USER, CLIENT_PROPOSE_MATCHUP, CLIENT_START_GAME, CLIENT_UPDATE_GAME, GAME_PLAYER_READY, GAME_PLAYER_MOVE, CLIENT_GAME_OVER, GAME_OFFER_DRAW, CLIENT_OFFER_DRAW, CLIENT_REPLY_DRAW, SERVER_SEND_CHAT_MESSAGE, CLIENT_SEND_CHAT_MESSAGE, GAME_REPLY_DRAW } from '../actions';


const initialState = {
    userType: "user",
    color: "white",
    gameState: "default",
    sessionId: "None",
    username: "None",
    opponentName: "None",
    gameId: "None",
    opponentId: "None",
    game: {
    },
    history: [],
    latestMessage: {},
    chatHistory: [],
    mmpreferences: {

    },
    moveCount: 0 //
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
            return state;
        case SERVER_REPLY_MATCHUP:
            return state;
        //message and channel
        case SERVER_SEND_CHAT_MESSAGE:
            return { ...state, action: "ownMessage", latestMessage: action.payload, chatHistory: [...state.chatHistory, action.payload.message] }

        // actions prefixed with CLIENT are triggered by the SERVER for general client state updates

        // client register is issued by the server after socket connects
        // sessionId is unique per user for both guests and registered clients
        // used to identify user session
        case CLIENT_REGISTER_USER:
            return state
        case CLIENT_PROPOSE_MATCHUP:
            return { ...state, action: "propose", opponentId: action.payload.sessionId, opponentName: action.payload.username }
        case CLIENT_START_GAME:
            console.log(action.payload)
            return { ...state, action: "initiateGame", gameState: "ongoing", game: action.payload.game, history: [], color: action.payload.color }
        case CLIENT_RESUME_GAME:
            return { ...state, action: "resumeGame", gameState: "ongoing", game: action.payload.game, history: action.payload.game.history, color: action.payload.color }
        case CLIENT_OFFER_DRAW:
            return { ...state, action: "offerDraw" }
        case CLIENT_REPLY_DRAW:
            return { ...state, action: "repliedDraw" }
        case CLIENT_RESUME_SESSION:
            return {
                ...state, userType: "user",
                sessionId: action.payload.sessionId,
                username: action.payload.username,
                opponentName: action.payload.opponentName,
                gameId: action.payload.gameId,
                opponentId: action.payload.opponentId
            }
        case CLIENT_GAME_OVER:
            return { ...state, action: "gameOver", gameState: "gameOver", winner: action.payload.winner }
        case CLIENT_UPDATE_GAME:
            return { ...state, action: "opponentMove", moveCount: state.moveCount += 1, move: action.payload.move, history: [...state.history, action.payload.move] }
        case CLIENT_SEND_CHAT_MESSAGE:
            return { ...state, action: "serverMessage", latestMessage: action.payload, chatHistory: [...state.chatHistory, action.payload] }
        // actions prefixed with GAME are triggered by the CLIENT for game-related actions on socket
        case GAME_PLAYER_READY:
            return { ...state, action: "gameReady", gameState: "ongoing" }
        case GAME_PLAYER_MOVE:
            return { ...state, action: "clientMove", moveCount: state.moveCount += 1, history: [...state.history, action.payload.move] };
        case GAME_OFFER_DRAW:
            return { ...state, action: "playerOfferDraw" }
        case GAME_REPLY_DRAW:
            return { ...state, action: "repliedDraw" }
        default:
            return state;
    }

}


export default reducer;
