import { SESSION_UNKNOWN, AUTH_REQUEST_SESSION, AUTH_REGISTER_ON_SOCKET, SERVER_REPLY_MATCHUP, CLIENT_START_GAME, CLIENT_SEND_CHAT_MESSAGE, CLIENT_RESUME_GAME } from './ActionTypes';
import { UserSession } from '../sessions/UserSession';
import PersonalMatchSession from '../sessions/PersonalMatchSession'
import { GameTypes } from '../GameTypes';

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
interface AuthRegisterOnSocket extends Action {
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

/* Game actions */
export interface ClientStartGame extends Action {
    type: typeof CLIENT_START_GAME;
    payload: PersonalMatchSession;
}

export interface ClientSendChatMessage extends Action {
    type: typeof CLIENT_SEND_CHAT_MESSAGE;
    payload: {
        sender: string;
        channel: string;
        message: string
    }
}

export interface ClientResumeGame extends Action {
    type: typeof CLIENT_RESUME_GAME;
    payload: PersonalMatchSession
}

export type ActionTypes =
    AuthSessionUnknownAction |
    AuthRequestSessionAction |
    AuthRegisterOnSocket |
    ServerReplyMatchup |
    ClientStartGame |
    ClientSendChatMessage |
    ClientResumeGame