import { SESSION_UNKNOWN, AUTH_REQUEST_SESSION, AUTH_REGISTER_ON_SOCKET } from './ActionTypes';
import { UserSession } from '../sessions/UserSession';

export default interface SocketAction {
    type: string;
    payload: object

}

interface AuthSessionUnknownAction extends SocketAction {
    type: typeof SESSION_UNKNOWN;
    payload: never;
}

interface AuthRequestSessionAction extends SocketAction {
    type: typeof AUTH_REQUEST_SESSION;
    payload: {
        sessionId: string;
    }
}
interface AuthRegisterOnSocekt extends SocketAction{
    type: typeof AUTH_REGISTER_ON_SOCKET;
    payload:never
}
export type SocketActionTypes =
    AuthSessionUnknownAction |
    AuthRequestSessionAction |
    AuthRegisterOnSocekt