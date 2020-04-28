import { SERVER_START_MATCHMAKING, MatchActionTypes, SERVER_PLAYER_MOVE, SERVER_CONCEDE, SERVER_OFFER_DRAW, SERVER_REPLY_DRAW, SERVER_SEND_CHAT_MESSAGE } from "./matchTypes";
import MatchmakingRequest from "./models/MatchmakingRequest";
import { Move } from "chess.js";
import ChatMessage from "./models/ChatMessage";

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

export function concede(gameId: string): MatchActionTypes {
    return {
        type: SERVER_CONCEDE,
        payload: {
            gameId: gameId
        }
    }
}

export function offerDraw(gameId: string): MatchActionTypes {
    return {
        type: SERVER_OFFER_DRAW,
        payload: {
            gameId: gameId
        }
    }
}

export function replyDraw(reply: boolean, gameId: string): MatchActionTypes {
    return {
        type: SERVER_REPLY_DRAW,
        payload: {
            reply: reply,
            gameId: gameId
        }
    }
}

export function sendChatMessage(chatMessage: ChatMessage): MatchActionTypes {

    return {
        type: SERVER_SEND_CHAT_MESSAGE,
        payload: chatMessage
    }
}