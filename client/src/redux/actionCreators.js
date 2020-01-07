import { SOCKET_START_MATCHMAKING, SOCKET_REPLY_MATCHUP, GAME_PLAYER_READY, GAME_PLAYER_MOVE } from "./gameState";

export const startMatchmaking = (matchup) => ({
    type: SOCKET_START_MATCHMAKING,
    payload: matchup
})
export const replyMatchmaking = (message) => ({
    type: SOCKET_REPLY_MATCHUP,
    payload: { reply: message.reply, opponentId: message.opponentId }
})
export const playerReady = () => ({
    type: GAME_PLAYER_READY
})
export const playerMove = (payload) => ({
    type: GAME_PLAYER_MOVE,
    payload:payload
})
