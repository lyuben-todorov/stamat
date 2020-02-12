import _ from 'lodash';
import redis from "ioredis";
import { CLIENT_RESUME_GAME, CLIENT_RESUME_SESSION } from "./actionTypes";
import redisClient from "../redis/redisClient";
import createLogger from "../createLogger";
import { Chess } from 'chess.js';
import attachRedisActions from './attachRedisActions';
import attachSocketActions from './attachSocketActions';

export default function (io: SocketIO.Server) {

    io.on("connection", (socket) => {

        const sessionId = socket.handshake.query.session;

        // send register as guest and boot socket
        if (_.isUndefined(sessionId) || sessionId == "null") {
            socket.disconnect();
            return;
        } else {


            const socketLogger = createLogger(sessionId.slice(-5));
            socketLogger.info("Socket connected");

            redisClient.hgetall(sessionId, (err, res) => {
                var chess;
                var clientUsername;
                var opponentId;
                var gameId;
                var opponentName;
                var color:any;
                var autoAccept = true;

                if (!err && _.isEmpty(res)) {
                    socketLogger.info("No session to restore found");

                } else {
                    socketLogger.info("Socket session retrieved successfully");

                    clientUsername = res.clientUsername;
                    opponentId = res.opponentId;
                    gameId = res.gameId;
                    opponentName = res.opponentName;
                    color = res.color;

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

                const personalChannel = new redis();
                personalChannel.subscribe(sessionId);

                // attach redis 
                attachRedisActions(personalChannel);
                attachSocketActions(socket);

            });
        }
    });
}
