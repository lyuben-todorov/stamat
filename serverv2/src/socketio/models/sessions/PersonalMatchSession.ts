import { GameTypes } from "../GameTypes";
import ChessParticipant from "../chess/ChessParticipant";
import MessageObject from "../chat/MessageObject";

export default interface PersonalMatchSession {

    matchId: string

    proponent: ChessParticipant
    opponent: ChessParticipant

    onMove: boolean;
    issueTime: number // unix time of issue by matchmaker
    gameTime: number //  game time by spec  in seconds 
    gameType: GameTypes // CHESS, CHESS_360?, FISCHER_CHESS?

    finished: boolean
    winner: string
    chatHistory: MessageObject[]  // 
    position: string // fen string
    moveHistory: string //not verbose
}