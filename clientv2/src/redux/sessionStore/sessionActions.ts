import {
    SessionState,
    SessionActionTypes,
    LOG_IN_USER,
    LOG_OUT_USER,
    AUTH_REGISTER_ON_SOCKET
} from './sessionTypes'
import { UserSession } from './sessionPayloadTypes'


export function registerOnSocket(session: UserSession): SessionActionTypes {
    return {
        type: AUTH_REGISTER_ON_SOCKET,
        payload: { sessionId: session.sessionId }
    }
}
export function loginUser(session: UserSession): SessionActionTypes {
    return {
        type: LOG_IN_USER,
        payload: session
    }
}
export function logoutUser(): SessionActionTypes {
    return {
        type: LOG_OUT_USER
    }
}