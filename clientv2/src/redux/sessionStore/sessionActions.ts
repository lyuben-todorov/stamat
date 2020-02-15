import {
    SessionState,
    SessionActionTypes,
    LOG_IN_USER,
    LOG_OUT_USER
} from './sessionTypes'
import { UserSession } from './sessionPayloadTypes'


export function loginUser(newSession: UserSession): SessionActionTypes {
    return {
        type: LOG_IN_USER,
        payload: newSession
    }
}
export function logoutUser(): SessionActionTypes {
    return {
        type: LOG_OUT_USER
    }
}