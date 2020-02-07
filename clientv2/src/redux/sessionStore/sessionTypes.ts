export interface SessionState {
    sessionId: String;
    userType: String;
    username: String;
    email?: String;
    inMatch: Boolean;
    matchId?: String;
}

export const LOG_IN_USER = "LOG_IN_USER";
export const LOG_OUT_USER = "LOG_OUT_USER";
