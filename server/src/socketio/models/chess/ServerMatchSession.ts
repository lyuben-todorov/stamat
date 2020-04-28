import { GameTypes } from "../GameType";
import ChessParticipant from "./ChessParticipant";
import { Move } from "chess.js";
import ChatMessage from "../chat/ChatMessage";
export default interface ServerMatchSession {
    matchId: string

    white: ChessParticipant
    black: ChessParticipant;

    // player ids of each side;
    whiteId: string;
    blackId: string;

    onMove: "white" | "black";
    issueTime: number; // unix time of issue by matchmaker
    gameTime: number; //  game time by spec  in seconds 
    gameType: GameTypes; // CHESS, CHESS_360?, FISCHER_CHESS?

    finished: boolean;
    winner?: string | "draw" | "none";
    chatHistory: ChatMessage[];  // 
    position: string; // fen string
    moveCount: number;
    moveHistory: Move[] //not verbose

    startTime: number;
    lastPlayerMoveTime: number;
    

}