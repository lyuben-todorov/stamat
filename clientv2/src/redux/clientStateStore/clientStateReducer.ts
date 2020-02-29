import { SessionActionTypes } from "../sessionStore/sessionTypes";
import { MatchActionTypes, CLIENT_START_GAME, CLIENT_UPDATE_GAME } from "../matchStore/matchTypes";

export interface ClientState {
    gameState: "ongoing" | "starting" | "default" | "update"
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
            return { gameState: "update" }
        default:
            return state;
    }
}