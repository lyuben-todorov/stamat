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
export default function (io: SocketIO.Server) {

    io.on("connection", (socket) => {
        var socketLogger: Logger = serverLogger;
        var userSession: UserSession;
        var sessionList: MatchSessionList;
        const personalChannel = new redis();

        socketLogger.info("Socket connected");

        /* until the session is initialized we only allow
        session registering events */
        socket.on('action', function actionCallback(action: SocketActionTypes) {

            if (action.type === AUTH_REQUEST_SESSION) {

                var payload = action.payload;

                redisClient.get(payload.sessiondId, (err, res) => {
                    if (!err && _.isEmpty(res)) {
                        socketLogger.info("No session to restore found");

                    } else {
                        var parsedUserSessionObject: UserSession = JSON.parse(res);

                        socketLogger = createLogger(parsedUserSessionObject.sessionId);

                        socketLogger.info("Socket session retrieved successfully");

                        userSession = parsedUserSessionObject

                        if (parsedUserSessionObject.inMatch) {
                            parsedUserSessionObject.matchIds.forEach(matchId => {
                                console.log(matchId)
                                redisClient.get(matchId + "object", (err, reply) => {
                                    var parsedMatchSessionObject: MatchSession = JSON.parse(reply);
                                    sessionList[parsedMatchSessionObject.matchId] = parsedMatchSessionObject;
                                })
                            });
                        }



                        socket.emit('action',
                            new ActionBuilder()
                                .setType(AUTH_RESPOND_SESSION)
                                .setPayload(parsedUserSessionObject)
                                .build(), () => {

                                    /* once we've given the client a session we want to unsubscribe
                                    our current on action event listener to avoid duplicate evens*/
                                    socket.removeListener('action', actionCallback)

                                    attachSocketActions(socket);
                                    attachRedisActions(personalChannel);
                                })
                    }
                })

            } else {
                socket.emit('action',
                    new ActionBuilder()
                        .setType(AUTH_SESSION_UNKNOWN)
                        .setPayload({})
                        .build()
                )
            }
        });

    });
}
