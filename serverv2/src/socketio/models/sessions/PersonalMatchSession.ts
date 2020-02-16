import { GameTypes } from "../GameTypes";

export default interface PersonalMatchSession {

    matchId: string

    playerName: string
    playerColor: string
    playerTime: string // individual time remaining in milliseconds 10*60*1000

    opponentName: string
    opponentColor: string
    opponentTime: string

    onMove: boolean;
    issueTime: number // unix time of issue by matchmaker
    gameTime: number //  game time by spec  in seconds 
    gameType: GameTypes // CHESS, CHESS_360?, FISCHER_CHESS?

    finished: boolean
    winner: string
    chatHistory: string[]  // 
    position: string // fen string
    moveHistory: string //not verbose
}