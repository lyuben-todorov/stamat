import { SOCKET_START_MATCHMAKING, SOCKET_REPLY_MATCHUP } from "./gameState";

export const startMatchmaking = (matchup) => ({
    type: SOCKET_START_MATCHMAKING,
    payload: matchup
})
export const replyMatchmaking = (message) => ({
    type: SOCKET_REPLY_MATCHUP,
    payload: { reply: message.reply, opponentId: message.opponentId }
})