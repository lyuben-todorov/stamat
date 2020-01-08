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
import { START_MATCHMAKING, REPLY_MATCHUP, GAME_PLAYER_READY, GAME_PLAYER_MOVE } from './clientActions';
import redisClient from './redis/redisClient'

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
app.use('/', indexRouter);
app.use('/auth', userRouter)



redisClient.set("mmqueue", 0);
redisClient.del("matchmaking_queue");
/** SOCKETS */
//app.listen(PORT, () => console.log(`Listening on ${PORT}`));
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
        const clientId = socket.id // TODO: Issue token here
        const socketLogger = createLogger(clientId);
        let host = false;
        let opponentId;
        let gameId;

        socketLogger.info("Socket connected");

        socket.emit('action', { type: "client/REGISTER", payload: clientId })

        //listen on personal channel for opponent
        const personalChannel = redis.createClient()
        personalChannel.subscribe(`${clientId}`); //bad, we want the personal channel id to be issued by the server

        personalChannel.on("message", (channel, message) => {
                redisLogger.info(clientId + " got message: " + message.substring(0,50) + "...");
                const messageObject = JSON.parse(message);
                let { type, payload } = messageObject;

                switch (type) {
                        case "acceptmatchup":
                                redisClient.get(gameId, (err, reply) => {
                                        matchmakingLogger.info("Matchup accepted:" + gameId)
                                        matchmakingLogger.info("Waiting for players: " + reply + "/2");
                                        if (reply === "2") {
                                                matchmakingLogger.info("STARTED GAME:" + gameId)

                                                let game = createGame(gameId, clientId, opponentId);
                                                redisClient.set(gameId + "object", JSON.stringify(game));


                                                redisClient.publish(clientId, serializeRedisMessage("gamestart", game));
                                                redisClient.publish(opponentId, serializeRedisMessage("gamestart", game));
                                        }
                                })
                                break;
                        case "proposematchup":
                                opponentId = payload

                                host ? gameId = clientId + opponentId : gameId = opponentId + clientId;
                                matchmakingLogger.info("Proposing Matchup to " + clientId + " ; against " + opponentId)

                                socket.emit('action', { type: "client/PROPOSE_MATCHUP", payload: opponentId })


                                break;
                        case "gamestart":{
                                socket.emit('action', { type: "client/START_GAME", payload: payload })
                                break;
                        }
                        case "gamemove": {
                                socket.emit('action', { type: "client/UPDATE_GAME", payload: payload })
                                break;
                        }
                }
        })
        socket.on('action', (action) => {
                socketLogger.info("Recieved action on socket:" + JSON.stringify(action).substring(0,50) + "...")
                switch (action.type) {
                        case START_MATCHMAKING:
                                // this is where matchmaking is supposed to go
                                // maybe connect to internal socket channel 'matchmaking', post the matchup and listen for found games
                                // mm logic should be handled by a third-party server
                                // base implementation works like 0/2 => 1/2 => 2/2 => 0/2
                                // this is ugly 

                                //get size of queue
                                redisClient.get("mmqueue", (err, queueSize) => {
                                        if (queueSize <= 0) {
                                                redisClient.rpush('matchmaking_queue', clientId)
                                                redisClient.incr("mmqueue")
                                                matchmakingLogger.info("Pushed client to MM queue:" + clientId)
                                        } else {
                                                redisClient.lpop('matchmaking_queue', (err, foundOpponentId) => {
                                                        if (foundOpponentId) {
                                                                redisClient.decr("mmqueue");
                                                                matchmakingLogger.info("Popped client from MM queue:" + foundOpponentId)

                                                                host = true;
                                                                opponentId = foundOpponentId;
                                                                gameId = clientId + opponentId;
                                                                redisClient.set(gameId, 0);


                                                                // propose to found 
                                                                redisClient.publish(opponentId, serializeRedisMessage("proposematchup", clientId))
                                                                redisClient.publish(clientId, serializeRedisMessage("proposematchup", opponentId))

                                                        } else {
                                                                matchmakingLogger.error("Queue is empty and this shouldn't be happening");
                                                        }
                                                })
                                        }
                                })
                                break;
                        case REPLY_MATCHUP:

                                // we don't handle rejects for now;
                                if (true) {

                                        redisClient.incr(gameId);
                                        redisClient.publish(opponentId, serializeRedisMessage("acceptmatchup", clientId));
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
                                        if (oldGame.toMove === clientId) {
                                                oldGame.toMove === oldGame.playerOne ? oldGame.toMove = oldGame.playerTwo : oldGame.toMove = oldGame.playerOne;
                                                let newGame = Object.assign(oldGame, game);
                                                redisClient.set(action.payload.gameId + "object", JSON.stringify(newGame))
                                                redisClient.publish(opponentId, serializeRedisMessage("gamemove", {game:newGame,move:move}));
                                        } else {
                                                console.log("no move")
                                        }
                                })
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