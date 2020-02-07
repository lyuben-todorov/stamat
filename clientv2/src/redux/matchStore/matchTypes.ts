export interface MatchState{
    
}

/* Client-Server actions */
export const SERVER_START_MATCHMAKING = "server/START_MATCHMAKING";
export const SERVER_REPLY_MATCHUP = "server/REPLY_MATCHUP";
export const SERVER_REGISTER_USER = "server/REGISTER_USER"
export const SERVER_SEND_CHAT_MESSAGE = "server/SEND_CHAT_MESSAGE";

/* Game actions */
export const SERVER_PLAYER_READY = "server/PLAYER_READY";
export const SERVER_PLAYER_MOVE = "server/PLAYER_MOVE";
export const SERVER_OFFER_DRAW = "server/OFFER_DRAW";
export const SERVER_REPLY_DRAW = "server/REPLY_DRAW";
export const SERVER_CONCEDE = "server/CONCEDE_GAME";

/* Server-Client actions */
export const CLIENT_GAME_OVER = "client/GAME_OVER";
export const CLIENT_UPDATE_GAME = "client/UPDATE_GAME";
export const CLIENT_OFFER_DRAW = "client/OFFER_DRAW";
export const CLIENT_REPLY_DRAW = "client/REPLY_DRAW";

export const CLIENT_PROPOSE_MATCHUP = "client/PROPOSE_MATCHUP";
export const CLIENT_START_GAME = "client/START_GAME";
export const CLIENT_ALREADY_IN_QUEUE = "client/ALREADY_IN_QUEUE"
export const CLIENT_REGISTER_USER = "client/REGISTER_USER";
export const CLIENT_SEND_CHAT_MESSAGE = "client/SEND_CHAT_MESSAGE"

export const CLIENT_RESUME_GAME = "client/RESUME_GAME";
export const CLIENT_RESUME_SESSION = "client/RESUME_SESSION"

/* Client-Matchmaker actions */
export const MATCHMAKER_ADD_TO_QUEUE = "matchmaker/ADD_TO_QUEUE"

export type MatchActionTypes = 