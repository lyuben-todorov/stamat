import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import createLogger from './logger';
import connectMongo from 'connect-mongo';
import session from 'express-session';
import cors from 'cors';
import io from 'socket.io'
import http from 'http'
import mongoConnection from './mongo/mongoClient';
import indexRouter from './routes/index';
import userRouter from './routes/auth';
import env from './env';
import redis from 'redis';
import { START_MATCHMAKING } from './clientActions';
import redisClient from './redis/redisClient'

const app = express();
const MongoStore = connectMongo(session)
const PORT = env.PORT || 5000;

const serverLogger = createLogger("Server")
const socketLogger = createLogger("Socket")
const redisLogger = createLogger('Redis');


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
const socket = io(server)

socket.on("connection", (socket) => {
        socketLogger.info("Socket connected: " + socket.id);
        socket.on('action', (action) => {
                socketLogger.info("Received action on socket:" + JSON.stringify(action))
                switch (action.type) {
                        case START_MATCHMAKING:
                                // this is where matchmaking is supposed to go
                                // maybe connect to internal socket channel 'matchmaking', post the matchup and listen for found games
                                // mm logic should be handled by a third server
                                // base implementation works like 0/2 => 1/2 => 2/2 => 0/2
                                break;

                }


                const redisSubscriber = redis.createClient();

                redisSubscriber.on("error", function (err) {
                        redisLogger.error("Redis error: " + err);
                });
                redisSubscriber.on("ready", () => {
                        redisLogger.info("Established redis connection!")

                });



        })
})

socket.on("disconnect", () => {
        socketLogger.info("Disconnected");
})



server.on("close", () => {

})
server.listen(PORT, () => { serverLogger.info(`Listening on ${PORT}`) })