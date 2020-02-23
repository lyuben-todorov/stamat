import { GameType } from "../GameType";
import ChessParticipant from "../chess/ChessParticipant";
import MessageObject from "../chat/MessageObject";
import { Move } from "chess.js";

export default interface PersonalMatchSession {

    matchId: string

    proponent: ChessParticipant
    opponent: ChessParticipant

    onMove: "white" | "black";
    issueTime: number // unix time of issue by matchmaker
    gameTime: number //  game time by spec  in seconds 
    gameType: GameType // CHESS, CHESS_360?, FISCHER_CHESS?

    finished: boolean
    winner: string
    chatHistory: MessageObject[]  // 
    position: string; // fen string
    moveCount: number;
    moveHistory: Move[] //not verbose
}