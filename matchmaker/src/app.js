import createLogger from './logger';
import env from './env';
import redis from 'ioredis'
import { SERVER_REGISTER_USER, MATCHMAKER_ADD_TO_QUEUE, SERVER_REPLY_MATCHUP, SERVER_START_MATCHMAKING, GAME_PLAYER_READY, GAME_PLAYER_MOVE, CLIENT_PROPOSE_MATCHUP, CLIENT_START_GAME, CLIENT_UPDATE_GAME, CLIENT_REGISTER_USER, CLIENT_ALREADY_IN_QUEUE } from './clientActions';
import redisClient from './redis/redisClient'
import crypto from 'crypto'
const PORT = env.PORT || 5000;

var init = redisClient.pipeline();
init
        .set("regularCount", 0)
        .set("regularCurrent", 0)
        .set("totalCount", 0)
        .set("totalCurrent", 0)
        .set("gamesIssued", 0)
        .del('matchmaking_queue')
        .exec();

const matchmakingLogger = createLogger("MATCHMAKER");
const matchmakingClient = new redis();


function serializeRedisMessage(type, payload) {
        return JSON.stringify({ type: type, payload: payload })
}
function createGame(gameId, p1id, p2id) {

        const startingPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        let white = Math.floor(Math.random() * 2) ? p1id : p2id;

        const gameObject = {
                gameId: gameId,
                playerOne: p1id,
                playerTwo: p2id,
                white: white,
                toMove: 'w',
                position: startingPosition,
                finished: false,
                winner: "none",
                history: []
        }
        return gameObject;
}
matchmakingClient.subscribe('matchmaking')

matchmakingClient.on('message', (channel, message) => {
        matchmakingLogger.info("Message:" + message);
        let messageObject = JSON.parse(message);
        let { type, payload } = messageObject;
        switch (type) {
                case MATCHMAKER_ADD_TO_QUEUE:
                        var { sessionId, username, opponentType, mode, time } = payload;
                        console.log(payload)
                        redisClient.incr(`${mode}Count`);
                        redisClient.hmset(sessionId, { username, opponentType, mode, type });

                        redisClient.sismember('matchmaking_queue', sessionId, (err, reply) => {
                                if (reply) {
                                        redisClient.publish(sessionId, serializeRedisMessage(CLIENT_ALREADY_IN_QUEUE));
                                } else {
                                        redisClient.sadd('matchmaking_queue', sessionId, (number) => {
                                                matchmakingLogger.info("Pushed client to MM queue:" + username)
                                                redisClient.smembers('matchmaking_queue', (err, reply) => {
                                                        if (!err) {
                                                                // all mm logic
                                                                if (reply.length === 2) {
                                                                        redisClient.srem('matchmaking_queue', reply[0], reply[1]);
                                                                        redisClient.decrby('totalCurrent', 2);

                                                                        redisClient.pipeline().hgetall(reply[0]).hgetall(reply[1]).exec((err, res) => {
                                                                                console.log(res);

                                                                                let playerOne = res[0][1];
                                                                                let playerTwo = res[1][1];


                                                                                matchmakingLogger.info(`Proposing matchup: ${playerOne.username} vs ${playerTwo.username}`);
                                                                                let gameId = Math.random().toString(36).substring(2, 14) + Math.random().toString(16).substring(2, 15) +
                                                                                        Math.random().toString(33).substring(2, 15);
                                                                                playerOne.gameId = gameId;
                                                                                playerTwo.gameId = gameId;
                                                                                console.log(playerTwo)
                                                                                console.log(playerOne)

//bad protocol rigght here----------------------------------------------------->//whoever is player one gets to generate game on client~
                                                                                // IF autoaccept is true
                                                                                // redisClient.publish(playerOne.sessionId, serializeRedisMessage(CLIENT_PROPOSE_MATCHUP, {
                                                                                //         gameId: gameId,
                                                                                //         opponentName: playerTwo.username,
                                                                                //         opponentId: playerTwo.sessionId,
                                                                                //         playerOneUsername: playerOne.username,
                                                                                // }));

                                                                                // redisClient.publish(playerTwo.sessionId, serializeRedisMessage(CLIENT_PROPOSE_MATCHUP, {
                                                                                //         gameId: gameId,
                                                                                //         opponentName: playerOne.username,
                                                                                //         opponentId: playerOne.sessionId,
                                                                                //         playerOneUsername: playerOne.username
                                                                                // }));

                                                                                let game = createGame(gameId, sessionId, opponentId);
                                                                                redisClient.set(gameId + "object", JSON.stringify(game));
        
                                                                                let opponentInfoOne = {
                                                                                        opponentId: playerTwo.sessionId,
                                                                                        opponentName: playerTwo.username,
                                                                                        gameId: gameId
                                                                                }
                                                                                let opponentInfoTwo = {
                                                                                        opponentId: playerOne.sessionId,
                                                                                        opponentName: playerOne.username,
                                                                                        gameId: gameId
                                                                                }
                                                                                redisClient.publish(playerOne.sessionId, serializeRedisMessage(CLIENT_START_GAME, { game, opponentInfo }));
                                                                                redisClient.publish(playerTwo.sessionId, serializeRedisMessage(CLIENT_START_GAME, { game, opponentInfo }));

                                                                        })


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


