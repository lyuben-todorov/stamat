import _ from 'lodash';
import redis from 'ioredis';

import { EventContext } from "../../EventContext";
import { RedisActionTypes, AuthRegisterOnSocket } from "../../models/actions/RedisActionTypes";
import { AUTH_REGISTER_ON_SOCKET, SESSION_UNKNOWN, RESPOND_SESSION, CLIENT_FOUND_GAME } from "../../models/actions/ActionTypes";
import ActionBuilder from "../../models/actions/ActionBuilder";
import createLogger from "../../../createLogger";
import redisClient from "../../../redis/redisClient";
import { UserSession } from "../../../socketio/models/sessions/UserSession";
import mainSocketDisconnectCallback from './mainRoutine/mainSocketDisconnectCallback';
import mainSocketActionCallback from './mainRoutine/mainSocketActionCallback';
import mainRedisMessageCallback from './mainRoutine/mainRedisMessageCallback';
import ServerMatchSession from '../../../socketio/models/chess/ServerMatchSession';
import returnPersonalMatchSession from '../../../util/returnPersonalMatchSession';
import { parse } from 'dotenv/types';
import { Chess } from 'chess.js';

export const loadSessionRoutine = function actionCallback(this: EventContext, action: RedisActionTypes) {
    var { type } = action;

    switch (type) {

        case AUTH_REGISTER_ON_SOCKET:

            //no need for block scope as there is only one action.
            const { payload } = action as AuthRegisterOnSocket


            this.socketLogger = createLogger(payload.sessionId.slice(-5));

            this.socketLogger.info("Session registered: " + payload.sessionId.slice(-5));

            redisClient.get(payload.sessionId, (err, res) => {
                if (!err && _.isEmpty(res)) {
                    this.socketLogger.info("No session to restore found");

                } else {
                    var parsedUserSessionObject: UserSession = JSON.parse(res);

                    this.socketLogger.info("Socket session retrieved successfully");

                    this.userSession = parsedUserSessionObject;

                    if ( this.userSession) {
                         this.userSession.matchIds.forEach(matchId => {
                            redisClient.get(matchId + "object", (err, reply) => {
                                var parsedMatchSessionObject: ServerMatchSession = JSON.parse(reply);
                                var personalizedSessionObject = returnPersonalMatchSession(parsedMatchSessionObject, payload.sessionId);

                                if (!personalizedSessionObject.finished) {

                                    this.chess = new Chess(personalizedSessionObject.position);

                                    this.activeGame = personalizedSessionObject.matchId;
                                    this.sessionList[personalizedSessionObject.matchId] = personalizedSessionObject;
                                    this.socket.emit('action',
                                        new ActionBuilder()
                                            .setType(CLIENT_FOUND_GAME)
                                            .setPayload({ gameObject: personalizedSessionObject })
                                    );
                                }
                            })
                        });
                    }


                    this.socket.removeAllListeners();

                    this.socket.on('disconnect', mainSocketDisconnectCallback.bind(this));
                    this.socket.on('action', mainSocketActionCallback.bind(this));

                    this.personalChannel = new redis();
                    this.personalChannel.subscribe(this.userSession.sessionId).then((res) => {

                    });

                    this.personalChannel.on('message', mainRedisMessageCallback.bind(this));
                    // mainRoutine.call(this);
                }
            })

            this.socket.emit('action',
                new ActionBuilder()
                    .setType(RESPOND_SESSION)
                    .setPayload({ status: "OK" })
                    .build())
            break;
        default:
            console.log(action)
            this.socket.emit('action',
                new ActionBuilder()
                    .setType(SESSION_UNKNOWN)
                    .setPayload({})
                    .build()
            )
    }
}