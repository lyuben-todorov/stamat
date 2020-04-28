import { SERVER_START_MATCHMAKING, SERVER_SEND_CHAT_MESSAGE, SERVER_PLAYER_READY, SERVER_PLAYER_MOVE, SERVER_CONCEDE, SERVER_OFFER_DRAW, SERVER_REPLY_DRAW } from "./ActionTypes";
import Action from "./RedisActionTypes";
import { GameTypes } from "../GameType";
import { GameTime } from "../GameTime";
import { Move } from "chess.js";
import ChatMessage from "../chat/ChatMessage";

export interface ServerStartMatchmaking extends Action {
    type: typeof SERVER_START_MATCHMAKING;
    payload: {
        opponentType: "USER" | "GUEST";
        mode: GameTypes
        time: GameTime
        username: string
        sessionId: string,
        autoAccept: true | false
    }
}

export interface ServerSendChatMessage extends Action {
    type: typeof SERVER_SEND_CHAT_MESSAGE,
    payload: ChatMessage
}

export interface ServerPlayerReady extends Action {
    type: typeof SERVER_PLAYER_READY
}

export interface ServerPlayerMove extends Action {
    type: typeof SERVER_PLAYER_MOVE,
    payload: {
        gameId: string,
        move: Move
    }

}

export interface ServerConcede extends Action {
    type: typeof SERVER_CONCEDE,
    payload: {
        gameId: string
    }
}

export interface ServerOfferDraw extends Action {
    type: typeof SERVER_OFFER_DRAW,
    payload: {
        gameId: string
    }
}

export interface ServerReplyDraw extends Action {
    type: typeof SERVER_REPLY_DRAW,
    payload: {
        reply: boolean,
        gameId: string
    }
}
export type SocketActionTypes =
    ServerSendChatMessage |
    ServerStartMatchmaking |
    ServerPlayerReady |
    ServerPlayerMove |
    ServerConcede |
    ServerOfferDraw |
    ServerReplyDraw