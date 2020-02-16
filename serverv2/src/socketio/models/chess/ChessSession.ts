import { MatchSession } from "../sessions/ServerMatchObject";
import ChessParticipant from "./ChessParticipant";
import { GameTypes } from "../GameTypes";

export interface ChessSession extends MatchSession {
    proponent: ChessParticipant
    oponent: ChessParticipant

    onMove: boolean
    gameType: GameTypes.CHESS
    position: String // fen string
    moveHistory: String //not verbose    

}