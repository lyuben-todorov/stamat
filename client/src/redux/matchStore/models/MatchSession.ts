import { GameTypes } from "../../GameTypes";
import ChessParticipant from "./ChessParticipant";

export interface MatchSession {
    matchId: string

    position: string // fen string

    proponent: ChessParticipant
    opponent: ChessParticipant


    onMove: boolean;
    issueTime: number // unix time of issue by matchmaker
    gameType: GameTypes // CHESS, CHESS_360?, FISCHER_CHESS?
    gameTime: number //  game time by spec  in seconds 

    finished: boolean
    winner: string
    chatHistory: string[]  // 
    moveHistory: string //not verbose
}