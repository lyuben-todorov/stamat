import { AUTH_SESSION_UNKNOWN } from '../ActionTypes';

interface SocketAction {
    type: string;
    payload: object

}

interface AuthSessionUnknownAction extends SocketAction {
    type: typeof AUTH_SESSION_UNKNOWN;
    payload: {
        sessionId: string;
    }
}


export type SocketActionTypes = AuthSessionUnknownAction 