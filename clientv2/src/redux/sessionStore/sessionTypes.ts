import { UserSession } from "./sessionPayloadTypes";

export interface SessionState{
    sessionId:string
    username:string
    email:string
    inMatch:boolean
    connected:boolean
    matchIds:string[]
    //session settings, matchmaker settings
    autoAccept:boolean
    userType:string

}

export const LOG_IN_USER = "LOG_IN_USER";
export const LOG_OUT_USER = "LOG_OUT_USER";


interface LoginUserAction {
    type: typeof LOG_IN_USER
    payload: UserSession
}
interface LogoutUserAction {
    type: typeof LOG_OUT_USER
}
export type SessionActionTypes = LoginUserAction | LogoutUserAction