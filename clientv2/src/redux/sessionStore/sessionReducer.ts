import {
    SessionState,
    SessionActionTypes,
    LOG_OUT_USER,
    LOG_IN_USER,
    AUTH_REGISTER_ON_SOCKET,
    RESPOND_SESSION
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
        case AUTH_REGISTER_ON_SOCKET:
            return state

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
        case RESPOND_SESSION:
            console.log(action.payload.status)
            return state;
        default:
            console.log("Unknown action received by server");
            console.log(action)
            return state;
    }
}
