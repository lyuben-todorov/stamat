import {
    SessionState,
    SessionActionTypes,
    LOG_OUT_USER,
    LOG_IN_USER
} from "./sessionTypes"

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
        case LOG_IN_USER:
            console.log("hi im " + action.payload);
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
        default:
            return state;
    }
}
