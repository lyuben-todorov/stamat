import { GameType } from "../GameType";
import MessageObject from "../chat/MessageObject";
import ChessParticipant from "./ChessParticipant";
import { Move } from "chess.js";
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