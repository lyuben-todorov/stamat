import { START_MATCHMAKING } from "./gameState";

export const startMatchmaking = (matchup) => ({
    type: START_MATCHMAKING,
    payload: matchup
})