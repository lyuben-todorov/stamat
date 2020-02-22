import { GameTypes } from "../GameTypes";
import MessageObject from "../chat/MessageObject";
import ChessParticipant from "./ChessParticipant";
export default interface ServerMatchSession {
    matchId: string

    white: ChessParticipant
    black: ChessParticipant;

    // player ids of each side;
    whiteId:string;
    blackId:string;

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