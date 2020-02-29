import UserSession from "./models/UserSession";

export const LOG_IN_USER = "LOG_IN_USER";
export const LOG_OUT_USER = "LOG_OUT_USER";

/* Auth actions */
// this is the 404 message
export const SESSION_UNKNOWN = "SESSION_UNKNOWN";

export const RESPOND_SESSION = "RESPOND_SESSION";

export const AUTH_REGISTER_ON_SOCKET = "auth/REGISTER_ON_SOCKET";

export const AUTH_TEST_CONNECTION = "auth/TEST_CONNECTION";
// hot action
interface RegisterOnSocketAction {
    type: typeof AUTH_REGISTER_ON_SOCKET
    payload: { sessionId: string }
}

interface TestConnectionAction {
    type: typeof AUTH_TEST_CONNECTION;
    payload: UserSession;
}
// cold actions
interface LogInUserAction {
    type: typeof LOG_IN_USER
    payload: UserSession
}
interface LogoutUserAction {
    type: typeof LOG_OUT_USER
}
interface RespondSessionAction {
    type: typeof RESPOND_SESSION
    payload: { status: string }
}
export type SessionActionTypes =
    RegisterOnSocketAction |
    LogoutUserAction |
    LogInUserAction |
    RespondSessionAction |
    TestConnectionAction