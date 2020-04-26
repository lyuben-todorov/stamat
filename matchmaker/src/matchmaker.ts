import createLogger from './createLogger';
import redis from 'ioredis'
import { MATCHMAKER_ADD_TO_QUEUE, CLIENT_START_GAME } from './ActionTypes';
import redisClient from './redis/redisClient'
import returnPersonalMatchSession from './util/returnPersonalMatchSession';
import serializeRedisMessage from './util/serializeRedisMessage';
import createGame from './util/createGame';
import { MatchmakingRequest, ServerMatchSession } from './types';

var init = redisClient.pipeline();
init.set("mode0count", 0) // number
    .del("mode0queue") // set
    .set("totalcount", 0)
    .set("totalcurrent", 0)
    .set("gamesissued", 0)
    .exec();

const matchmakingLogger = createLogger("MATCHMAKER");
const matchmakingClient = new redis();

matchmakingClient.subscribe('matchmaking')

matchmakingClient.on('message', (channel, message) => {
    var messageObject = JSON.parse(message);

    var { type } = messageObject;
    switch (type) {
        case MATCHMAKER_ADD_TO_QUEUE:
            var matchmakingRequest: MatchmakingRequest = messageObject.payload;

            var { username, mode,  } = matchmakingRequest;

            var vreq = JSON.stringify(matchmakingRequest);

            redisClient.sadd(`mode${mode}queue`, vreq).then((added) => {

                if (added == 1) {

                    redisClient.incr(`mode${mode}count`).then((modeCount) => {
                        matchmakingLogger.info(`${modeCount} people in ${mode} queue`);

                        redisClient.scard(`mode${mode}queue`).then((queueSize) => {
                            if (queueSize === 2) {
                                // sufficient players to start game
                                redisClient.spop(`mode${mode}queue`, 2).then((players) => {
                                    redisClient.decrby(`mode${mode}count`, 2);

                                    var playerOneString = players[0];
                                    var playerTwoString = players[1];

                                    var playerOne: MatchmakingRequest = JSON.parse(playerOneString);
                                    var playerTwo: MatchmakingRequest = JSON.parse(playerTwoString);

                                    var gameId = Math.random().toString(36).substring(2, 14) +
                                        Math.random().toString(32).substring(2, 15) +
                                        Math.random().toString(33).substring(2, 15);
                                    matchmakingLogger.info(`Starting game ${gameId}: ${playerOne.username} vs ${playerTwo.username}`);

                                    var game: ServerMatchSession = createGame(gameId, playerOne, playerTwo);

                                    redisClient.set(gameId + "object", JSON.stringify(game));

                                    const p1s = returnPersonalMatchSession(game, playerOne.sessionId);
                                    const p2s = returnPersonalMatchSession(game, playerTwo.sessionId);

                                    redisClient.publish(playerOne.sessionId, serializeRedisMessage(CLIENT_START_GAME, { game: p1s, opponentId: playerTwo.sessionId }));
                                    redisClient.publish(playerTwo.sessionId, serializeRedisMessage(CLIENT_START_GAME, { game: p2s, opponentId: playerOne.sessionId }));

                                })
                            }
                        })
                    })
                } else {
                    matchmakingLogger.warn(`${username} already in queue`);
                }
            })

            break;
    }
})


