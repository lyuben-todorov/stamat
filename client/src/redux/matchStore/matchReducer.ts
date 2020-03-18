import { MatchSession } from "./models/MatchSession";
import MatchSessionList from "./models/MatchSessionList";
import { MatchActionTypes, SERVER_START_MATCHMAKING, CLIENT_START_GAME, CLIENT_UPDATE_GAME, SERVER_PLAYER_MOVE, CLIENT_GAME_OVER, CLIENT_OFFER_DRAW, CLIENT_REPLY_DRAW } from "./matchTypes";
import { CLIENT_FOUND_GAME } from './matchTypes'
import { match } from "assert";
import { Move } from "chess.js";
export interface MatchState {
    activeMatch: string,
    matches: MatchSessionList,
    lastMove: Move
}

const initialState: MatchState = {
    activeMatch: null,
    matches: {},
    lastMove: null,
}
export function matchReducer(
    state = initialState,
    action: MatchActionTypes
): MatchState {
    switch (action.type) {
        case CLIENT_FOUND_GAME:
            {
                console.log(action.payload.gameObject);
                var matches = state.matches;
                var matchId = action.payload.gameObject.matchId;
                matches[matchId] = action.payload.gameObject;

                return { ...state, activeMatch: matchId, matches: matches }
            }
        case CLIENT_START_GAME:
            {

                var matches = state.matches;
                console.log(action.payload);
                var matchId = action.payload.game.matchId;
                matches[matchId] = action.payload.game;

                return { ...state, activeMatch: matchId, matches: matches }
            }
        case CLIENT_UPDATE_GAME:
            {

                var matchId = action.payload.gameId;
                state.matches[matchId] = action.payload.newGame;

                return { ...state, lastMove: action.payload.move }
            }
        case CLIENT_GAME_OVER:
            {
                var matchId = action.payload.game.matchId;

                state.matches[matchId] = action.payload.game;

                return { ...state }
            }
        case CLIENT_OFFER_DRAW:
            {
                return { ...state }
            }
        case CLIENT_REPLY_DRAW:
            {
                return { ...state }
            }
        case SERVER_PLAYER_MOVE:
            {
                console.log(action.payload.gameId);
                if (action.payload.gameId && state.activeMatch && state.matches[action.payload.gameId]) {

                    var move = action.payload.move
                    var matchId = action.payload.gameId;

                    var match = state.matches[matchId];
                    match.moveHistory.push(move);

                    state.matches[matchId] = match;

                    return { ...state, lastMove: move };
                } else {
                    return state;
                }
            }
        default:
            return state;
    }
}