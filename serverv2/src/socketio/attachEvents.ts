import _ from 'lodash';
import redis from "ioredis";
import { CLIENT_RESUME_GAME, CLIENT_RESUME_SESSION, AUTH_REQUEST_SESSION, AUTH_SESSION_UNKNOWN } from "./models/ActionTypes";
import redisClient from "../redis/redisClient";
import createLogger from "../createLogger";
import { Chess } from 'chess.js';
import attachRedisActions from './actions/attachRedisActions';
import attachSocketActions from './actions/attachSocketActions';
import { Logger } from 'winston';
import { UserSession } from './models/sessions/UserSession';
import SessionList from './models/sessions/SessionList';
import { serverLogger } from '../server'
import SocketAction from './models/actions/SocketAction';
import ActionBuilder from './models/actions/ActionBuilder';
export default function (io: SocketIO.Server) {

    io.on("connection", (socket) => {
        var socketLogger: Logger = serverLogger;
        var userSession: UserSession;
        var sessionList: SessionList;
        const personalChannel = new redis();


        socket.on('action', (action: SocketAction) => {
            if (action.type === AUTH_REQUEST_SESSION) {
                
            } else {
                socket.emit('action',
                    new ActionBuilder()
                        .setType(AUTH_SESSION_UNKNOWN)
                        .setPayload({})
                        .build()
                )
            }
        })
        socketLogger.info("Socket connected");

        redisClient.hgetall(sessionId, (err, res) => {
            if (!err && _.isEmpty(res)) {
                socketLogger.info("No session to restore found");

            } else {
                socketLogger.info("Socket session retrieved successfully");

                if (res.gameId) {
                    redisClient.get(res.gameId + "object", (err, reply) => {
                        if (reply) {

                            let gameObject = JSON.parse(reply);
                            if (!gameObject.finished) {
                                chess = new Chess(gameObject.position);

                                socket.emit('action', { type: CLIENT_RESUME_GAME, payload: { game: gameObject, color: color === 'w' ? 'white' : 'black' } });


                            } else {
                                opponentName = "None";
                                opponentId = "None";
                                gameId = "none";
                            }
                        } else {

                        }
                    })
                }

                socket.emit('action', {
                    type: CLIENT_RESUME_SESSION,
                    payload: {
                        userType: "user",
                        sessionId: sessionId,
                        username: clientUsername,
                        opponentName: opponentName,
                        gameId: gameId ? gameId : "none",
                        opponentId: opponentId,
                    }
                })

            }

            personalChannel.subscribe();

            // attach redis 
            attachRedisActions(personalChannel);
            attachSocketActions(socket);

        });
    }
    });
}
