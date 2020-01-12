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
import redis from 'redis';
import { SERVER_REGISTER_USER, SERVER_REPLY_MATCHUP, SERVER_START_MATCHMAKING, GAME_PLAYER_READY, GAME_PLAYER_MOVE, CLIENT_PROPOSE_MATCHUP, CLIENT_START_GAME, CLIENT_UPDATE_GAME, CLIENT_REGISTER_USER, CLIENT_ALREADY_IN_QUEUE, MATCHMAKER_ADD_TO_QUEUE } from './clientActions';
import redisClient from './redis/redisClient'
import mongoose from 'mongoose'

const app = express();
const MongoStore = connectMongo(session)
const PORT = env.PORT || 5000;

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
                toMove: white,
                position: startingPosition,
                history: ""
        }
        return gameObject;
}

io.on("connection", (socket) => {
        const sessionId = socket.handshake.query.session;

        var clientUsername;
        const socketLogger = createLogger(sessionId.slice(-5));
        var host = false;
        var opponentId;

        var opponentName;
        var gameId;

        socketLogger.info("Socket connected");

        socket.emit('action', { type: CLIENT_REGISTER_USER, payload: sessionId })

        //listen on personal channel for opponent
        const personalChannel = redis.createClient()
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

                                                                redisClient.publish(sessionId, serializeRedisMessage(CLIENT_START_GAME, game));
                                                                redisClient.publish(opponentId, serializeRedisMessage(CLIENT_START_GAME, game));
                                                        }
                                                })
                                        }
                                })
                                break;
                        case CLIENT_PROPOSE_MATCHUP:

                                gameId = payload.gameId;
                                opponentId = payload.sessionId;
                                opponentName = payload.username;
                                matchmakingLogger.info("Proposing Matchup to " + clientUsername + " ; against " + payload.username);

                                socket.emit('action', { type: CLIENT_PROPOSE_MATCHUP, payload: payload })


                                break;
                        case CLIENT_START_GAME: {
                                socket.emit('action', { type: CLIENT_START_GAME, payload: payload })
                                break;
                        }
                        case GAME_PLAYER_MOVE: {
                                socket.emit('action', { type: CLIENT_UPDATE_GAME, payload: payload })
                                break;
                        }
                }
        })
        socket.on("disconnect", () => {

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
                                let { move, game } = action.payload;

                                redisClient.get(action.payload.gameId + "object", (err, reply) => {
                                        let oldGame = JSON.parse(reply);

                                        // player is on move
                                        if (oldGame.toMove === sessionId) {
                                                oldGame.toMove === oldGame.playerOne ? oldGame.toMove = oldGame.playerTwo : oldGame.toMove = oldGame.playerOne;
                                                let newGame = Object.assign(oldGame, game);
                                                redisClient.set(action.payload.gameId + "object", JSON.stringify(newGame))
                                                redisClient.publish(opponentId, serializeRedisMessage(GAME_PLAYER_MOVE, { game: newGame, move: move }));
                                        } else {
                                                console.log("no move")
                                        }
                                })
                                break;
                        case SERVER_REGISTER_USER:
                                break;
                        default:
                                console.log(action);


                }

        })
})

io.on("disconnect", () => {
        socketLogger.info("Disconnected");
})



server.on("close", () => {

})
server.listen(PORT, () => { serverLogger.info(`Listening on ${PORT}`) })