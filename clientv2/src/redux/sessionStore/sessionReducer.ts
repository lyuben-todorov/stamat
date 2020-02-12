import {
    SessionState,
    SessionActionTypes,
    LOG_OUT_USER,
    LOG_IN_USER
} from "./sessionTypes"

const initialState: SessionState = {
    sessionId: "none",
    userType: "none",
    username: "none",
    inMatch: false,
    loggedIn: false
}
export function sessionReducer(
    state = initialState,
    action: SessionActionTypes
): SessionState {
    switch (action.type) {
        case LOG_IN_USER:
            return {
                ...this.state,
                sessionId: action.payload.sessionId,
                userType: action.payload.userType
            };
        case LOG_OUT_USER:
            return state;
        default:
            return state;
    }
}
