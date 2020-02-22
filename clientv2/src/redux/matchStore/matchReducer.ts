import { MatchSession } from "./models/MatchSession";
import MatchSessionList from "./models/MatchSessionList";
import { MatchActionTypes } from "./matchTypes";
import { CLIENT_FOUND_GAME } from './matchTypes'
export interface MatchState {
    activeMatch: string | "none",
    matches: MatchSessionList,
}

const initialState: MatchState = {
    activeMatch: "none",
    matches: {}
}
export function matchReducer(
    state = initialState,
    action: MatchActionTypes
): MatchState {
    switch (action.type) {
        case CLIENT_FOUND_GAME:
            var matches = state.matches;
            var matchId = action.payload.gameObject.matchId;
            matches[matchId] = action.payload.gameObject;
            return { activeMatch: matchId, matches: matches }
        default:
            return state;
    }
}