import { GameTypes } from "../GameType";
import ChessParticipant from "../chess/ChessParticipant";
import { Move } from "chess.js";
import ChatMessage from "../chat/ChatMessage";

export default interface PersonalMatchSession {

    matchId: string

    position: string; // fen string

    proponent: ChessParticipant
    opponent: ChessParticipant

    onMove: "white" | "black";
    issueTime: number // unix time of issue by matchmaker
    gameTime: number //  game time by spec  in seconds 
    gameType: GameTypes // CHESS, CHESS_360?, FISCHER_CHESS?

    finished: boolean
    winner: string
    chatHistory: ChatMessage[];  // 
    moveCount: number;
    moveHistory: Move[] //not verbose

    lastPlayerMoveTime: number;

}