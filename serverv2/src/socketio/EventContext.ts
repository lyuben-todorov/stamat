import { Redis } from "ioredis";
import MatchSessionList from "./models/sessions/MatchSessionList";
import { UserSession } from "./models/sessions/UserSession";
import { Logger } from "winston";
import { ChessInstance } from "chess.js";
export interface EventContext {
    (...args: any[]): void

    socket: SocketIO.Socket;
    socketLogger: Logger;
    userSession: UserSession;
    sessionList: MatchSessionList;
    personalChannel: Redis;
    chess: ChessInstance;

}