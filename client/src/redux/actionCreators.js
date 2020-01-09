import { SERVER_START_MATCHMAKING, SERVER_REPLY_MATCHUP, GAME_PLAYER_READY, GAME_PLAYER_MOVE } from "./gameState";

export const startMatchmaking = (matchup) => ({
    type: SERVER_START_MATCHMAKING,
    payload: matchup
})
export const replyMatchmaking = (message) => ({
    type: SERVER_REPLY_MATCHUP,
    payload: { reply: message.reply, opponentId: message.opponentId,username:message.username }
})


export const playerReady = () => ({
    type: GAME_PLAYER_READY
})
export const playerMove = (payload) => ({
    type: GAME_PLAYER_MOVE,
    payload:payload
})
