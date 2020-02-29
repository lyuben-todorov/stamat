import { Move } from "chess.js";

export interface ServerMatchSession {
    matchId: string

    white: ChessParticipant
    black: ChessParticipant;

    // player ids of each side;
    whiteId: string;
    blackId: string;

    onMove: "white" | "black";
    issueTime: number; // unix time of issue by matchmaker
    gameTime: number; //  game time by spec  in seconds 
    gameType: GameType; // CHESS, CHESS_360?, FISCHER_CHESS?

    finished: boolean;
    winner?: string | "draw" | "none";
    chatHistory: MessageObject[];  // 
    position: string; // fen string
    moveCount: number;
    moveHistory: Move[] //not verbose

    startTime: number;
    lastPlayerMoveTime: number;

}

export interface ChessParticipant {
    name: string
    color: string
    timeLeft: number
}

export enum GameType {
    CHESS
}
export type GameTime = 15 | 10 | 5;

export interface MessageObject {
    messageBody: string
    channel: string
    sender: string;
}
export interface MatchmakingRequest {
    opponentType: "USER" | "GUEST";
    mode: GameType
    time: GameTime
    username: string
    sessionId: string,
    autoAccept: boolean
}