import { MatchSession } from "./models/MatchSession";
import MatchSessionList from "./models/MatchSessionList";
import { MatchActionTypes, SERVER_START_MATCHMAKING, CLIENT_START_GAME, CLIENT_UPDATE_GAME, SERVER_PLAYER_MOVE, CLIENT_GAME_OVER, CLIENT_OFFER_DRAW, CLIENT_REPLY_DRAW, CLIENT_SEND_CHAT_MESSAGE, SERVER_SEND_CHAT_MESSAGE } from "./matchTypes";
import { CLIENT_FOUND_GAME } from './matchTypes'
import { match } from "assert";
import { Move } from "chess.js";
import ChatMessage from "./models/ChatMessage";
export interface MatchState {
    activeMatch: string,
    matches: MatchSessionList,
    lastMove: Move
    chatHistory: ChatMessage[]
}

const initialState: MatchState = {
    activeMatch: null,
    matches: {},
    lastMove: null,
    chatHistory: []
}
export function matchReducer(
    state = initialState,
    action: MatchActionTypes
): MatchState {
    switch (action.type) {
        case CLIENT_FOUND_GAME:
            {
                var matches = state.matches;
                var matchId = action.payload.gameObject.matchId;
                matches[matchId] = action.payload.gameObject;

                return { ...state, activeMatch: matchId, matches: matches }
            }
        case CLIENT_START_GAME:
            {

                var matches = state.matches;
                var matchId = action.payload.game.matchId;
                matches[matchId] = action.payload.game;

                return { ...state, activeMatch: matchId, matches: matches }
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
        case CLIENT_SEND_CHAT_MESSAGE:
            {
                let chatHistory: ChatMessage[] = state.chatHistory;
                chatHistory.push(action.payload);
                return { ...state, chatHistory: chatHistory }
            }
        case CLIENT_UPDATE_GAME:
            {
                // handle client update when recieving move data from server

                var matchId = action.payload.gameId;
                state.matches[matchId] = action.payload.newGame;

                return { ...state, lastMove: action.payload.move }
            }
        case SERVER_PLAYER_MOVE:
            // handle client update when sending move data to server
            {
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
        case SERVER_SEND_CHAT_MESSAGE:
            // handle client update when sending chat message
            {
                let chatHistory: ChatMessage[] = state.chatHistory;
                chatHistory.push(action.payload);
                return { ...state, chatHistory: chatHistory }
            }
        default:
            return state;
    }
}