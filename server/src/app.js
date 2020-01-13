import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import createLogger from './logger';
import connectMongo from 'connect-mongo';
import session from 'express-session';
import cors from 'cors';
import socketio from 'socket.io'
import http from 'http'
import mongoConnection from './mongo/mongoClient';
import indexRouter from './routes/index';
import userRouter from './routes/auth';
import env from './env';
import { CLIENT_RESUME_SESSION, CLIENT_RESUME_GAME as CLIENT_RESUME_GAME, GAME_OVER, SERVER_REPLY_MATCHUP, SERVER_START_MATCHMAKING, GAME_PLAYER_READY, GAME_PLAYER_MOVE, CLIENT_PROPOSE_MATCHUP, CLIENT_START_GAME, CLIENT_UPDATE_GAME, MATCHMAKER_ADD_TO_QUEUE, GAME_CONCEDE, GAME_OFFER_DRAW, CLIENT_GAME_OVER } from './clientActions';
import redisClient from './redis/redisClient'
import mongoose from 'mongoose'
import Chess from 'chess.js';
import redis from 'ioredis'

const app = express();
const MongoStore = connectMongo(session)
const PORT = env.PORT || 5000;

const gameLogger = createLogger("Game");
const serverLogger = createLogger("Server");
const socketLogger = createLogger("Socket");
const redisLogger = createLogger("Redis");
const matchmakingLogger = createLogger("Matchmaking")

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
mongoose.set('useCreateIndex', true);

// Session middleware
app.use(session({
        secret: env.APP_SECRET,
        store: new MongoStore({ mongooseConnection: mongoConnection }),
        resave: false,
        cookie: {
                maxAge: 60000,
        },
        saveUninitialized: false
}))

app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/', indexRouter);
app.use('/auth', userRouter)

redisClient.set("mmqueue", 0);
redisClient.del("matchmaking_queue");

/** SOCKETS */
const server = http.createServer(app);
const io = socketio(server)


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
                winner:"none",
                history: []
        }
        return gameObject;
}

io.on("connection", (socket) => {
        const sessionId = socket.handshake.query.session;


        const socketLogger = createLogger(sessionId.slice(-5));
        socketLogger.info("Socket connected");

        redisClient.hgetall(sessionId, (err, res) => {
                var chess;
                var clientUsername;
                var opponentId;
                var gameId;
                var opponentName;
                if (!err && err !== null) {
                        socketLogger.info("No session found" + err);

                } else {
                        socketLogger.info("Socket session retrieved successfully");

                        clientUsername = res.clientUsername;
                        opponentId = res.opponentId;
                        gameId = res.gameId;
                        opponentName = res.opponentName;

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
                        });

                        if (res.gameId) {
                                redisClient.get(res.gameId + "object", (err, reply) => {
                                        let gameObject = JSON.parse(reply);
                                        if (!gameObject.finished) {
                                                chess = new Chess.Chess(gameObject.position);

                                                // write socket action payloads in a verbose way for code readability
                                                // not payload: { ... , ... , .. } or payload: payload
                                                socket.emit('action', { type: CLIENT_RESUME_GAME, payload: { game: gameObject } });

                                        }
                                })
                        }

                }

                //listen on personal channel for opponent
                const personalChannel = new redis()

                personalChannel.subscribe(sessionId);

                personalChannel.on("message", (channel, message) => {
                        redisLogger.info(" Got message: " + message);
                        const messageObject = JSON.parse(message);
                        let { type, payload } = messageObject;

                        switch (type) {
                                case SERVER_REPLY_MATCHUP:
                                        redisClient.get(gameId, (err, reply) => {
                                                if (err) {
                                                        redisClient.set(gameId, 1);
                                                } else {

                                                        redisClient.get(gameId, (err, reply) => {
                                                                matchmakingLogger.info("Matchup accepted:" + gameId)
                                                                matchmakingLogger.info("Waiting for players: " + reply + "/2");
                                                                if (reply === "2") {
                                                                        matchmakingLogger.info("STARTED GAME:" + gameId.trim(-5))

                                                                        let game = createGame(gameId, sessionId, opponentId);
                                                                        redisClient.set(gameId + "object", JSON.stringify(game));

                                                                        redisClient.publish(sessionId, serializeRedisMessage(CLIENT_START_GAME, { game }));
                                                                        redisClient.publish(opponentId, serializeRedisMessage(CLIENT_START_GAME, { game }));
                                                                }
                                                        })
                                                }
                                        })
                                        break;
                                case CLIENT_PROPOSE_MATCHUP:

                                        gameId = payload.gameId;
                                        opponentId = payload.sessionId;
                                        opponentName = payload.username;
                                        matchmakingLogger.info("Proposing Matchup to " + clientUsername + " ; against " + opponentName);

                                        socket.emit('action', { type: CLIENT_PROPOSE_MATCHUP, payload: payload })


                                        break;
                                case CLIENT_START_GAME:
                                        chess = new Chess.Chess();
                                        socket.emit('action', { type: CLIENT_START_GAME, payload: { game: payload.game } })
                                        break;

                                case CLIENT_RESUME_GAME:
                                        socket.emit('action', { type: CLIENT_RESUME_GAME, payload: { game: payload.game } })
                                        break;


                                case CLIENT_UPDATE_GAME:
                                        // update socket chess instance;
                                        chess.move(payload.move)
                                        socket.emit('action', { type: CLIENT_UPDATE_GAME, payload: payload });
                                        if (payload.finished && chess.game_over()) {
                                                socket.emit('action', { type: CLIENT_GAME_OVER, payload: { winner: payload.winner } })
                                        }
                                        break;

                                // in case game isn't ended by a move
                                case CLIENT_GAME_OVER:
                                        socket.emit('action', { type: CLIENT_GAME_OVER, payload: { winner: payload.winner } });
                                        break;
                        }
                })
                socket.on("disconnect", () => {
                        // persist session here
                        socketLogger.info("Socket disconnected");
                        let sessionObject = {
                                sessionId: sessionId,
                                clientUsername: clientUsername,
                                gameId: gameId,
                                opponentId: opponentId,
                                opponentName: opponentName
                        }
                        redisClient.hmset(sessionId, sessionObject, (err, res) => {
                                if (!err) {
                                        redisLogger.info(`Session persisted successfully: ${sessionId.slice(-5)}`);

                                } else {
                                        redisLogger.error(`Error persisting session ${sessionId.slice(-5)}: ${err}`)
                                }
                        })
                        // if we don't quit explicitly we run into a fun bug
                        personalChannel.quit()
                });
                socket.on('action', (action) => {
                        socketLogger.info("Recieved action on socket:" + JSON.stringify(action))
                        switch (action.type) {
                                case SERVER_START_MATCHMAKING:
                                        clientUsername = action.payload.username;
                                        redisClient.publish('matchmaking', serializeRedisMessage(MATCHMAKER_ADD_TO_QUEUE, {
                                                "username": action.payload.username,
                                                "sessionId": action.payload.sessionId
                                        }))

                                        break;
                                case SERVER_REPLY_MATCHUP:

                                        // we don't handle rejects for now;
                                        if (action.payload.reply) {
                                                redisClient.incr(gameId);
                                                redisClient.publish(opponentId, serializeRedisMessage(SERVER_REPLY_MATCHUP, sessionId));
                                        }
                                        break;
                                case GAME_PLAYER_READY:
                                        // player has received game state 
                                        break;
                                case GAME_PLAYER_MOVE:
                                        redisClient.get(action.payload.gameId + "object", (err, reply) => {
                                                let oldGame = JSON.parse(reply);

                                                // player is on move
                                                //      XNOR
                                                if ((oldGame.white === sessionId) == (oldGame.toMove === 'w')) {
                                                        var newMove = chess.move(action.payload.move);
                                                        // is move legal;
                                                        if (newMove === null) {
                                                                gameLogger.info("Client sending illegal move")
                                                                return;
                                                        }

                                                        // copy game object
                                                        let newGame = oldGame;

                                                        newGame.history.push(newMove);
                                                        newGame.position = chess.fen();
                                                        newGame.toMove = newGame.toMove === 'w' ? 'b' : 'w';
                                                        if (chess.game_over()) {
                                                                //checkmate
                                                                newGame.finished = true;
                                                                newGame.winner = sessionId;
                                                                socket.emit('action', { type: CLIENT_GAME_OVER, payload: { winner: sessionId } })

                                                        }

                                                        //set new game object
                                                        redisClient.set(action.payload.gameId + "object", JSON.stringify(newGame))
                                                        redisClient.publish(opponentId, serializeRedisMessage(CLIENT_UPDATE_GAME,
                                                                {
                                                                        gameId: action.payload.gameId,
                                                                        move: action.payload.move,
                                                                        finished: newGame.finished,
                                                                        winner: newGame.finished ? sessionId : "none"
                                                                }));
                                                } else {
                                                        console.log("no move")
                                                }
                                        })
                                        break;
                                case GAME_CONCEDE:
                                        redisClient.get(gameId + "object", (err, reply) => {
                                                let finishedGame = JSON.parse(reply);
                                                finishedGame.finished = true;
                                                // save game to static storage here;
                                                redisClient.set(gameId + "object", JSON.stringify(finishedGame));
                                                redisClient.publish(finishedGame.playerOne, serializeRedisMessage(CLIENT_GAME_OVER, { winner: opponentId }));
                                                redisClient.publish(finishedGame.playerTwo, serializeRedisMessage(CLIENT_GAME_OVER, { winner: opponentId }));

                                        })
                                        break;
                                case GAME_OFFER_DRAW:
                                        break;
                                default:
                                        console.log(action);
                        }
                })
        })
})

io.on("disconnect", () => {
        socketLogger.info("Disconnected");
})

server.on("close", () => {

})
server.listen(PORT, () => { serverLogger.info(`Listening on ${PORT}`) })