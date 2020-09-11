import {
    SessionActionTypes,
    LOG_OUT_USER,
    LOG_IN_USER,
    AUTH_REGISTER_ON_SOCKET,
    RESPOND_SESSION,
    AUTH_TEST_CONNECTION
} from "./sessionTypes"


export interface SessionState {
    sessionId: string
    username: string
    email: string
    inMatch: boolean
    connected: boolean
    matchIds: string[]
    //session settings, matchmaker settings
    autoAccept: boolean
    userType: string

}

const initialState: SessionState = {
    sessionId: "",
    username: "",
    email: "",
    inMatch: false,
    connected: false,
    matchIds: [],
    //session settings, matchmaker settings
    userType: "GUEST",
    autoAccept: false
}


export function sessionReducer(
    state = initialState,
    action: SessionActionTypes
): SessionState {
    switch (action.type) {
        case AUTH_REGISTER_ON_SOCKET:
            return state;
        case AUTH_TEST_CONNECTION:
            return state;

        case LOG_IN_USER:
            return {
                ...state,
                sessionId: action.payload.sessionId,
                username: action.payload.username,
                email: action.payload.email,
                inMatch: action.payload.inMatch,
                connected: action.payload.connected,
                matchIds: action.payload.matchIds,

                autoAccept: action.payload.autoAccept,
                userType: "USER",

            };

        case LOG_OUT_USER:
            return state;
        case RESPOND_SESSION:
            return state;
        default:
            return state;
    }
}
