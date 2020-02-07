import { LoginPayload } from "./sessionPayloadTypes";

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


interface LoginUserAction {
    type: typeof LOG_IN_USER
    payload: LoginPayload
}
interface LogoutUserAction{
    type: typeof LOG_OUT_USER
}
export type SessionActionTypes =  LoginUserAction | LogoutUserAction