import { MatchmakingRequest, MessageObject, ServerMatchSession, GameType } from "../types";
import { Move } from "chess.js";

export default function createGame(gameId: string, playerOne: MatchmakingRequest, playerTwo: MatchmakingRequest): ServerMatchSession {

    const startingPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    const white = Math.floor(Math.random() * 2);
    const gameObject: ServerMatchSession = {

        matchId: gameId,

        white: {
            name: white ? playerOne.username : playerTwo.username,
            color: "white",
            timeLeft: 600000
        },
        black: {
            name: white ? playerTwo.username : playerOne.username,
            color: "black",
            timeLeft: 600000
        },

        // player ids of each side;
        whiteId: white ? playerOne.sessionId : playerTwo.sessionId,
        blackId: white ? playerTwo.sessionId : playerOne.sessionId,

        onMove: "white",
        issueTime: Date.now(),
        gameTime: 600000,
        gameType: GameType.CHESS, // CHESS, CHESS_360?, FISCHER_CHESS?

        finished: false,
        winner: "none",
        chatHistory: [] as MessageObject[],  // 
        position: startingPosition, // fen string
        moveCount: 0,
        moveHistory: [] as Move[], //not verbose

        startTime: -1,
        lastPlayerMoveTime: -1,
    }
    return gameObject;
}