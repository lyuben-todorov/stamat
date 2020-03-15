import ServerMatchSession from "../socketio/models/chess/ServerMatchSession";
import PersonalMatchSession from "../socketio/models/sessions/PersonalMatchSession";

export default function returnPersonalMatchSession(session: ServerMatchSession, playerId: string): PersonalMatchSession {
    var color = session.whiteId === playerId;
    return {
        matchId: session.matchId,

        proponent: color ? session.white : session.black,
        opponent: color ? session.black : session.white,

        onMove: session.onMove,
        issueTime: session.issueTime,
        gameTime: session.gameTime,
        gameType: session.gameType,

        finished: session.finished,
        winner: session.winner,
        chatHistory: session.chatHistory,
        position: session.position,
        moveCount: session.moveCount,
        moveHistory: session.moveHistory,
        
        lastPlayerMoveTime: session.lastPlayerMoveTime
    }
}