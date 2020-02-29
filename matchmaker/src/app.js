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

function returnPersonalMatchSession(session, playerId) {
        var color = session.whiteId === playerId;
        return {
                matchId: session.matchId,

                proponent: color ? session.white : session.black,
                opponent: color ? session.black : session.white,

                onMove: session.onMove,
                issueTime: session.issueTime,
                gameTime: session.gameTime,
                gameType: session.gameType,

                finished: session.finished,
                winner: session.winner,
                chatHistory: session.chatHistory,
                position: session.position,
                moveCount: session.moveCount,
                moveHistory: session.moveHistory,

                startTime: session.startTime,
                lastPlayerMoveTime: session.lastPlayerMoveTime,
        }
}
function serializeRedisMessage(type, payload) {
        return JSON.stringify({ type: type, payload: payload })
}
function createGame(gameId, playerOne, playerTwo) {

        const startingPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        let white = Math.floor(Math.random() * 2);
        const gameObject = {

                matchId: gameId,

                white: {
                        name: white ? playerOne.username : playerTwo.username,
                        color: "white",
                        timeLeft: 600000
                },
                black: {
                        name: white ? playerTwo.username : playerOne.username,
                        color: "black",
                        timeLeft: 600000
                },

                // player ids of each side;
                whiteId: white ? playerOne.sessionId : playerTwo.sessionId,
                blackId: white ? playerTwo.sessionId : playerOne.sessionId,

                onMove: "white",
                issueTime: Date.now(),
                gameTime: 600000,
                gameType: "CHESS", // CHESS, CHESS_360?, FISCHER_CHESS?

                finished: false,
                winner: "none",
                chatHistory: [],  // 
                position: startingPosition, // fen string
                moveCount: 0,
                moveHistory: [], //not verbose

                startTime: -1,
                lastPlayerMoveTime: -1,
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
                        var { sessionId, username, opponentType, mode, time } = payload.matchObject;
                        console.log(payload)
                        if (sessionId) {
                                redisClient.incr(`chessCount`);
                                redisClient.hmset(sessionId, { username, opponentType, mode, type });

                                redisClient.sismember('matchmaking_queue', sessionId, (err, reply) => {

                                        if (reply) {

                                                redisClient.publish(sessionId, serializeRedisMessage(CLIENT_ALREADY_IN_QUEUE));
                                        } else {
                                                redisClient.sadd('matchmaking_queue', sessionId, (number,err) => {
                                                        if(err){
                                                                console.log("asd");
                                                        }
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


                                                                                        const p1s = returnPersonalMatchSession(game, playerOne.sessionId);
                                                                                        const p2s = returnPersonalMatchSession(game, playerTwo.sessionId);

                                                                                        redisClient.publish(playerOne.sessionId, serializeRedisMessage(CLIENT_START_GAME, { game: p1s }));
                                                                                        redisClient.publish(playerTwo.sessionId, serializeRedisMessage(CLIENT_START_GAME, { game: p2s }));

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


