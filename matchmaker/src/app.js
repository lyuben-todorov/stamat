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
function createGame(gameId, playerOne, playerTwo) {

        const startingPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        let white = Math.floor(Math.random() * 2);
        const gameObject = {
                moveCount: 0,
                issueTime: Date.now(),
                gameId: gameId,
                playerOneName: playerOne.username,
                playerTwoName: playerTwo.username,
                whiteName: white ? playerOne.username : playerTwo.username,
                blackName: white ? playerTwo.username : playerOne.username,
                playerOne: playerOne.sessionId,
                playerTwo: playerTwo.sessionId,
                playerOneColor: white ? 'w' : 'b',
                playerTwoColor: white ? 'b' : 'w',
                blackTime: 600000,
                whiteTime: 600000,
                gameTime: 600000,
                toMove: 'w',
                white: white ? playerOne.sessionId : playerTwo.sessionId,
                black: white ? playerTwo.sessionId : playerOne.sessionId,
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
                        if (sessionId) {
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

                                                                                        let playerOne = res[0][1];
                                                                                        let playerTwo = res[1][1];


                                                                                        matchmakingLogger.info(`Proposing matchup: ${playerOne.username} vs ${playerTwo.username}`);
                                                                                        let gameId = Math.random().toString(36).substring(2, 14) + Math.random().toString(16).substring(2, 15) +
                                                                                                Math.random().toString(33).substring(2, 15);
                                                                                        playerOne.gameId = gameId;
                                                                                        playerTwo.gameId = gameId;

                                                                                        let game = createGame(gameId, playerOne, playerTwo);
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
                                                                                        redisClient.publish(playerOne.sessionId, serializeRedisMessage(CLIENT_START_GAME, { game: game, opponentInfo: opponentInfoOne, color: game.playerOneColor }));
                                                                                        redisClient.publish(playerTwo.sessionId, serializeRedisMessage(CLIENT_START_GAME, { game: game, opponentInfo: opponentInfoTwo, color: game.playerTwoColor }));

                                                                                })


                                                                        }
                                                                } else {
                                                                        matchmakingLogger.error(err);
                                                                }
                                                        })
                                                })


                                        }

                                })
                        }

                        break;
        }
})


