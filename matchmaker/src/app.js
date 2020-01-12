import createLogger from './logger';
import env from './env';
import redis from 'redis';
import { SERVER_REGISTER_USER, MATCHMAKER_ADD_TO_QUEUE, SERVER_REPLY_MATCHUP, SERVER_START_MATCHMAKING, GAME_PLAYER_READY, GAME_PLAYER_MOVE, CLIENT_PROPOSE_MATCHUP, CLIENT_START_GAME, CLIENT_UPDATE_GAME, CLIENT_REGISTER_USER, CLIENT_ALREADY_IN_QUEUE } from './clientActions';
import redisClient from './redis/redisClient'
import crypto from 'crypto'
const PORT = env.PORT || 5000;

const matchmakingLogger = createLogger("MATCHMAKER");
const matchmakingClient = redis.createClient();


function serializeRedisMessage(type, payload) {
        return JSON.stringify({ type: type, payload: payload })
}
redisClient.del('matchmaking_queue');

matchmakingClient.subscribe('matchmaking')

matchmakingClient.on('message', (channel, message) => {
        matchmakingLogger.info("Message:" + message);
        let messageObject = JSON.parse(message);
        let { type, payload } = messageObject;
        switch (type) {
                case MATCHMAKER_ADD_TO_QUEUE:
                        let { sessionId, username } = payload;
                        let serializedObject = JSON.stringify(payload);
                        matchmakingLogger.info(serializedObject);
                        redisClient.sismember('matchmaking_queue', serializedObject, (err, reply) => {
                                if (reply) {
                                        redisClient.publish(sessionId, serializeRedisMessage(CLIENT_ALREADY_IN_QUEUE));
                                } else {
                                        redisClient.sadd('matchmaking_queue', serializedObject, (number) => {
                                                matchmakingLogger.info("Pushed client to MM queue:" + username)
                                                redisClient.smembers('matchmaking_queue', (err, reply) => {
                                                        if (!err) {
                                                                // all mm logic
                                                                if (reply.length === 2) {
                                                                        redisClient.SREM('matchmaking_queue', reply[0], reply[1]);
                                                                        let playerOne = JSON.parse(reply[0]);
                                                                        let playerTwo = JSON.parse(reply[1]);
                                                                        matchmakingLogger.info(`Proposing matchup: ${playerOne.username} vs ${playerTwo.username}`);
                                                                        let gameId = Math.random().toString(36).substring(2, 14) + Math.random().toString(16).substring(2, 15) +
                                                                                Math.random().toString(33).substring(2, 15);
                                                                        playerOne.gameId = gameId;
                                                                        playerTwo.gameId = gameId;
                                                                        console.log(playerTwo)
                                                                        console.log(playerOne)
                                                                        redisClient.publish(playerOne.sessionId, serializeRedisMessage(CLIENT_PROPOSE_MATCHUP, playerTwo));

                                                                        redisClient.publish(playerTwo.sessionId, serializeRedisMessage(CLIENT_PROPOSE_MATCHUP, playerOne));
                                                                }
                                                        } else {
                                                                matchmakingLogger.error(err);
                                                        }
                                                })
                                        })


                                }

                        })

                        break;
        }
})


