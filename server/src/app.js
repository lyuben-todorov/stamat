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
const io = socketio(server)

io.on("connection", (socket) => {
        socketLogger.info("Socket connected: " + socket.id);


        socket.emit('action',{type:"client/REGISTER", data: socket.id})
        socket.on('action', (action) => {
                socketLogger.info("Received action on socket:" + JSON.stringify(action))
                switch (action.type) {
                        case START_MATCHMAKING:
//01:36:05 | [Socket] [info]: Received action on socket:{"type":"matchmaking/START_MATCHMAKING","payload":{"username":"gosho","socketId":"-sp2x_yx-0HFeyU7AAAI"}}
                                // this is where matchmaking is supposed to go
                                // maybe connect to internal socket channel 'matchmaking', post the matchup and listen for found games
                                // mm logic should be handled by a third server
                                // base implementation works like 0/2 => 1/2 => 2/2 => 0/2
                                // this is ugly 
                                //get size of queue
                                redisClient.get("mmqueue", (err, queueSize) => {
                                        const userid = action.payload.socketId;
                                        if (queueSize <= 0) {
                                                redisClient.rpush('matchmaking_queue', userid)
                                                redisClient.incr("mmqueue")
                                        } else {
                                                redisClient.rpop('matchmaking_queue', (err,reply) => {
                                                        if(err)redisLogger.error(err);

                                                        // found opponent
                                                        console.log(reply)
                                                        redisClient.publish(reply, "proposematchup:" + userid)
                                                })
                                        }
                                        //listen on personal channel for opponent
                                        const personalChannel = redis.createClient()
                                        personalChannel.subscribe(userid);
                                        personalChannel.on("message", (channel, message) => {
                                                switch(message){
                                                        case "acceptmatchup":
                                                                const gameId = channel + userid;
                                                                
                                                                redisClient.publish(channel,"gameon:" + gameId);
                                                                redisClient.publish(userid,"gameon:" + gameId);

                                                                break;
                                                        case "proposematchup":
                                                                //ask client 
                                                                //wait for client reply
                                                                redisClient.publish("","acceptmatchup")
                                                                break;
                                                }
                                        })

                                })
                                break;



                }


                const redisSubscriber = redis.createClient();



        })
})

io.on("disconnect", () => {
        socketLogger.info("Disconnected");
})



server.on("close", () => {

})
server.listen(PORT, () => { serverLogger.info(`Listening on ${PORT}`) })