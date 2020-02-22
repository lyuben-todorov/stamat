import ChessParticipant from "./ChessParticipant";
import { GameTypes } from "../GameTypes";
import MessageObject from "../chat/MessageObject";

export interface ChessSession {
    matchId: string

 
    
    proponent: ChessParticipant
    opponent: ChessParticipant
    
    onMove: boolean
    issueTime: number // unix time of issue by matchmaker
    gameType: GameTypes.CHESS
    gameTime: number //  game time by spec  in seconds 
    
    finished: boolean
    winner: String
    chatHistory: MessageObject[]  // 
    position: String // fen string
    moveHistory: String //not verbose    
    
}