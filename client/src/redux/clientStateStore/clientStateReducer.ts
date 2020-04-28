import { SessionActionTypes } from "../sessionStore/sessionTypes";
import { MatchActionTypes, CLIENT_START_GAME, CLIENT_UPDATE_GAME, ACKNOWLEDGE, CLIENT_FOUND_GAME, SERVER_PLAYER_MOVE, CLIENT_GAME_OVER, CLIENT_OFFER_DRAW, CLIENT_REPLY_DRAW, CLIENT_SEND_CHAT_MESSAGE, SERVER_SEND_CHAT_MESSAGE } from "../matchStore/matchTypes";

export type gameState = "ongoing" |
    "starting" |
    "default" |
    "server_update" |
    "client_update" |
    "ack" |
    "continue" |
    "game_over" |
    "pro_offer_draw" |
    "opp_offer_draw" |
    "opp_reply_draw" |
    "receive_chat_message";
export interface ClientState {
    gameState: gameState
}

const initialState: ClientState = {
    gameState: "default",
}
export function clientStateReducer(
    state = initialState,
    action: MatchActionTypes | SessionActionTypes
): ClientState {
    switch (action.type) {
        case CLIENT_START_GAME:
            return { gameState: "starting" }
        case CLIENT_UPDATE_GAME:
            return { gameState: "server_update" }
        case CLIENT_FOUND_GAME:
            return { gameState: "continue" }
        case CLIENT_GAME_OVER:
            return { gameState: "game_over" }
        case CLIENT_OFFER_DRAW:
            return { gameState: "opp_offer_draw" }
        case CLIENT_REPLY_DRAW:
            return { gameState: "opp_reply_draw" }
        case ACKNOWLEDGE:
            return { gameState: "ack" }
        case CLIENT_SEND_CHAT_MESSAGE:
            return { gameState: "receive_chat_message" }
        case SERVER_SEND_CHAT_MESSAGE:
            console.log("yes")
            return { gameState: "receive_chat_message" }
        case SERVER_PLAYER_MOVE:
            return { gameState: "client_update" }
        default:
            return state;
    }
}

export function acknowledge(): MatchActionTypes {
    return {
        type: ACKNOWLEDGE
    }
}