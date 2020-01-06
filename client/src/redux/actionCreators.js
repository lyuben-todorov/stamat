import { SOCKET_START_MATCHMAKING } from "./gameState";

export const startMatchmaking = (matchup) => ({
    type: SOCKET_START_MATCHMAKING,
    payload: matchup
})