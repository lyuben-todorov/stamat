import { SESSION_UNKNOWN, AUTH_REQUEST_SESSION, AUTH_REGISTER_ON_SOCKET, SERVER_REPLY_MATCHUP, CLIENT_START_GAME } from './ActionTypes';
import { UserSession } from '../sessions/UserSession';

export default interface Action {
    type: string;
    payload: object

}

/* AUTH */
interface AuthSessionUnknownAction extends Action {
    type: typeof SESSION_UNKNOWN;
    payload: never;
}

interface AuthRequestSessionAction extends Action {
    type: typeof AUTH_REQUEST_SESSION;
    payload: {
        sessionId: string;
    }
}
interface AuthRegisterOnSocekt extends Action {
    type: typeof AUTH_REGISTER_ON_SOCKET;
    payload: never
}

/* MATCHMAKING */

export interface ServerReplyMatchup extends Action {
    type: typeof SERVER_REPLY_MATCHUP;
    payload: {
        matchId: string
    }
}

export interface ClientStartGame extends Action{
    type:typeof CLIENT_START_GAME,
    payload:{
        
    }
}
export type ActionTypes =
    AuthSessionUnknownAction |
    AuthRequestSessionAction |
    AuthRegisterOnSocekt |
    ServerReplyMatchup