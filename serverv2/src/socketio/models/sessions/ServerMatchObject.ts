import { GameTypes } from "../GameTypes";
import MessageObject from "../chat/MessageObject";
export interface MatchSession {
    matchId: string

    issueTime: number // unix time of issue by matchmaker
    gameTime: number //  game time by spec  in seconds 
    gameType: GameTypes // CHESS, CHESS_360?, FISCHER_CHESS?

    finished: boolean
    winner: String
    chatHistory: MessageObject[]  // 
}