import { SERVER_START_MATCHMAKING, SERVER_REPLY_MATCHUP, GAME_PLAYER_READY, GAME_PLAYER_MOVE, SERVER_REGISTER_USER, GAME_CONCEDE, GAME_OFFER_DRAW, SERVER_SEND_CHAT_MESSAGE, GAME_REPLY_DRAW } from "../actions";

export const startMatchmaking = (payload) => ({
    type: SERVER_START_MATCHMAKING,
    payload: payload
});
export const replyMatchmaking = (payload) => ({
    type: SERVER_REPLY_MATCHUP,
    payload: payload
});

export const sendChatMessage = (payload) =>({
    type:SERVER_SEND_CHAT_MESSAGE,
    payload:payload
})

export const registerUser = (payload) => ({
    type: SERVER_REGISTER_USER,
    payload: payload
});

export const concedeGame = () =>({
    type: GAME_CONCEDE
})
export const offerDraw = () =>({
    type: GAME_OFFER_DRAW
})
export const replyDraw = (payload) =>({
    type: GAME_REPLY_DRAW,
    payload:{reply:payload}
})
export const playerReady = () => ({
    type: GAME_PLAYER_READY
});
export const playerMove = (payload) => ({
    type: GAME_PLAYER_MOVE,
    payload:payload
});

