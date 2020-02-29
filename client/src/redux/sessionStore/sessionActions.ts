import {
    SessionActionTypes,
    LOG_IN_USER,
    LOG_OUT_USER,
    AUTH_REGISTER_ON_SOCKET,
    AUTH_TEST_CONNECTION
} from './sessionTypes'
import UserSession from './models/UserSession'


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
export function testConnection(session: UserSession): SessionActionTypes {
    return {
        type: AUTH_TEST_CONNECTION,
        payload: session
    }
}