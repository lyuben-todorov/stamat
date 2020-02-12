import { AUTH_SESSION_UNKNOWN, AUTH_RESPOND_SESSION, AUTH_REQUEST_SESSION } from '../ActionTypes';
import { UserSession } from '../sessions/UserSession';

interface SocketAction {
    type: string;
    payload: object

}

interface AuthSessionUnknownAction extends SocketAction {
    type: typeof AUTH_SESSION_UNKNOWN;
    payload: never;
}
interface AuthRespondSessionAction extends SocketAction {
    type: typeof AUTH_RESPOND_SESSION;
    payload: UserSession
}
interface AuthRequestSessionAction extends SocketAction {
    type: typeof AUTH_REQUEST_SESSION;
    payload: {
        sessiondId: string;
    }
}
export type SocketActionTypes =
    AuthSessionUnknownAction |
    AuthRespondSessionAction |
    AuthRequestSessionAction