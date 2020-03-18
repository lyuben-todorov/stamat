import { SessionActionTypes } from "../sessionStore/sessionTypes";
import { MatchActionTypes, CLIENT_START_GAME, CLIENT_UPDATE_GAME, ACKNOWLEDGE, CLIENT_FOUND_GAME, SERVER_PLAYER_MOVE, CLIENT_GAME_OVER, CLIENT_OFFER_DRAW, CLIENT_REPLY_DRAW } from "../matchStore/matchTypes";

export interface ClientState {
    gameState: "ongoing" |
    "starting" |
    "default" |
    "server_update" |
    "client_update" |
    "ack" |
    "continue" |
    "game_over" |
    "pro_offer_draw" |
    "opp_offer_draw" |
    "opp_reply_draw"
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
            return { gameState: "opp_reply_draw"}
        case ACKNOWLEDGE:
            return { gameState: "ack" }
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