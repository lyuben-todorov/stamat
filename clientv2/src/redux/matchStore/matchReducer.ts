import { MatchSession } from "./models/MatchSession";
import MatchSessionList from "./models/MatchSessionList";
import { MatchActionTypes, SERVER_START_MATCHMAKING, CLIENT_START_GAME, CLIENT_UPDATE_GAME } from "./matchTypes";
import { CLIENT_FOUND_GAME } from './matchTypes'
import { match } from "assert";
import { Move } from "chess.js";
export interface MatchState {
    activeMatch: string | "none",
    matches: MatchSessionList,
    lastMove: Move
}

const initialState: MatchState = {
    activeMatch: "none",
    matches: {},
    lastMove: null,
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
            return { ...state, activeMatch: matchId, matches: matches }
        case CLIENT_START_GAME:
            var matches = state.matches;
            var matchId = action.payload.game.matchId;
            matches[matchId] = action.payload.game;
            return { ...state, activeMatch: matchId, matches: matches }
        case CLIENT_UPDATE_GAME:
            var matchId = action.payload.gameId;
            state.matches[matchId] = action.payload.newGame;
            console.log(action);
            return { ...state, lastMove: action.payload.move }
        default:
            return state;
    }
}