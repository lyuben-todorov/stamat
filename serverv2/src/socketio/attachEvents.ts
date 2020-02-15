import _ from 'lodash';
import redis from "ioredis";
import { Logger } from 'winston';
import { CLIENT_RESUME_GAME, AUTH_REQUEST_SESSION, AUTH_SESSION_UNKNOWN, AUTH_RESPOND_SESSION } from "./models/ActionTypes";
import attachRedisActions from './actions/attachRedisActions';
import attachSocketActions from './actions/attachSocketActions';
import { UserSession } from './models/sessions/UserSession';
import MatchSessionList from './models/sessions/MatchSessionList';
import { SocketActionTypes } from './models/actions/SocketAction';
import { serverLogger } from '../server'
import ActionBuilder from './models/actions/ActionBuilder';
import redisClient from "../redis/redisClient";
import createLogger from "../createLogger";
import { MatchSession } from './models/sessions/MatchSession';
import { EventContext } from './EventContext';

export default function (io: SocketIO.Server) {

    io.on("connection", (socket) => {
        var socketLogger: Logger = serverLogger;
        var userSession: UserSession;
        var sessionList: MatchSessionList;
        const personalChannel = new redis();

        socketLogger.info("Socket connected");

        /* until the session is initialized we only allow
        session registering events */


    });
}
