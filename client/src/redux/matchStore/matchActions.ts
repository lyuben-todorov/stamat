import { SERVER_START_MATCHMAKING, MatchActionTypes, SERVER_PLAYER_MOVE } from "./matchTypes";
import MatchmakingRequest from "./models/MatchmakingRequest";
import { Move } from "chess.js";

export function startMatchmaking(payload: MatchmakingRequest): MatchActionTypes {
    return {
        type: SERVER_START_MATCHMAKING,
        payload: payload
    }
}

export function playerMove(move: Move, gameId: string): MatchActionTypes {
    return {
        type: SERVER_PLAYER_MOVE,
        payload: {
            gameId: gameId,
            move: move
        }
    }
}