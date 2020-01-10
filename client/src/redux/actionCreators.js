import { SERVER_START_MATCHMAKING, SERVER_REPLY_MATCHUP, GAME_PLAYER_READY, GAME_PLAYER_MOVE, SERVER_REGISTER_USER } from "./gameState";

export const startMatchmaking = (payload) => ({
    type: SERVER_START_MATCHMAKING,
    payload: payload
});
export const replyMatchmaking = (payload) => ({
    type: SERVER_REPLY_MATCHUP,
    payload: payload
});
export const registerUser = (payload) => ({
    type: SERVER_REGISTER_USER,
    payload: payload
});

export const playerReady = () => ({
    type: GAME_PLAYER_READY
});
export const playerMove = (payload) => ({
    type: GAME_PLAYER_MOVE,
    payload:payload
});
