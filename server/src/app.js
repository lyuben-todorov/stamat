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
import { START_MATCHMAKING, REPLY_MATCHUP } from './clientActions';
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
/** SOCKETS */
//app.listen(PORT, () => console.log(`Listening on ${PORT}`));
const server = http.createServer(app);
const io = socketio(server)

io.on("connection", (socket) => {
        const clientId = socket.id // TODO: Issue token here
        const socketLogger = createLogger(clientId);
        let host = false;
        let opponentId;
        let gameId;
        let proposedGameId;

        socketLogger.info("Socket connected");

        socket.emit('action', { type: "client/REGISTER", payload: clientId })

        //listen on personal channel for opponent
        const personalChannel = redis.createClient()
        personalChannel.subscribe(`${clientId}`); //bad, we want the personal channel id to be issued by the server

        personalChannel.on("message", (channel, message) => {
                redisLogger.info(clientId + " got message: " + message);
                const actions = message.split('/');
                let actionType = actions[0];
                let payload = actions[1];
                switch (actionType) {
                        case "acceptmatchup":
                                redisClient.get(gameId, (err, reply) => {
                                        matchmakingLogger.info("Matchup accepted:" + gameId)
                                        matchmakingLogger.info("Waiting for players: " + reply + "/2");
                                        console.log(reply)
                                        if (reply === "2") {
                                                redisClient.publish(clientId, "gamestart/" + gameId);
                                                redisClient.publish(opponentId, "gamestart/" + gameId);
                                        } 
                                })
                                break;
                        case "proposematchup":
                                opponentId = payload

                                host ? gameId = clientId + opponentId : gameId = opponentId + clientId;


                                console.log(clientId);
                                console.log(opponentId);
                                socket.emit('action', { type: "client/PROPOSE_MATCHUP", payload: opponentId })

                                matchmakingLogger.info("Proposing Matchup to " + clientId + " ; against " + opponentId)

                                break;
                        case "gamestart":
                                matchmakingLogger.info("STARTED GAME:" + payload)
                                socket.emit('action', { type: "client/START_GAME", payload: payload })
                                break;
                }
        })
        socket.on('action', (action) => {
                socketLogger.info("Receivedved action on socket:" + JSON.stringify(action))
                switch (action.type) {
                        case START_MATCHMAKING:
                                //01:36:05 | [Socket] [info]: Received action on socket:{"type":"matchmaking/START_MATCHMAKING","payload":{"username":"gosho","socketId":"-sp2x_yx-0HFeyU7AAAI"}}
                                // this is where matchmaking is supposed to go
                                // maybe connect to internal socket channel 'matchmaking', post the matchup and listen for found games
                                // mm logic should be handled by a third-party server
                                // base implementation works like 0/2 => 1/2 => 2/2 => 0/2
                                // this is ugly 
                                //get size of queue
                                redisClient.get("mmqueue", (err, queueSize) => {
                                        console.log(queueSize)
                                        if (queueSize <= 0) {
                                                redisClient.rpush('matchmaking_queue', clientId)
                                                redisClient.incr("mmqueue")
                                                matchmakingLogger.info("Pushed client to MM queue:" + clientId)
                                        } else {
                                                redisClient.rpop('matchmaking_queue', (err, foundOpponentId) => {
                                                        if (foundOpponentId) {
                                                                redisClient.decr("mmqueue");
                                                                matchmakingLogger.info("Popped client from MM queue:" + foundOpponentId)

                                                                host = true;
                                                                gameId = clientId + opponentId;
                                                                redisClient.set(gameId, 0);
                                                                opponentId = foundOpponentId;


                                                                // propose to found opponent
                                                                redisClient.publish(opponentId, "proposematchup/" + clientId)
                                                                redisClient.publish(clientId, "proposematchup/" + opponentId)

                                                        } else {
                                                                matchmakingLogger.error("Queue is empty and this shouldn't be happening");
                                                        }
                                                })
                                        }
                                })
                                break;
                        case REPLY_MATCHUP:

                                redisClient.incr(gameId);

                                redisClient.publish(opponentId, "acceptmatchup/" + clientId);
                                break;
                }

        })
})

io.on("disconnect", () => {
        socketLogger.info("Disconnected");
})



server.on("close", () => {

})
server.listen(PORT, () => { serverLogger.info(`Listening on ${PORT}`) })