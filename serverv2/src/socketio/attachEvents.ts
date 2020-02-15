import _ from 'lodash';
import redis from "ioredis";
import { serverLogger } from '../server'
import loadSessionRoutine from './actions/routines/loadSessionRoutine';
import { Socket } from 'socket.io';


export default function (io: SocketIO.Server) {

    io.on("connection", function actionCallback(socket: Socket) {
        // var socketLogger: Logger = serverLogger;
        // var userSession: UserSession;
        // var sessionList: MatchSessionList;
        // const personalChannel = new redis();

        // var sessionLoaded: boolean = false;

        this.socket = socket;
        this.socketLogger.info("Socket connected");

        socket.on('action', loadSessionRoutine.bind(this));

    }.bind({
        socketLogger: serverLogger,
        userSession: {},
        sessionList: {},
        personalChannel: new redis(),
        sessionLoaded: false
    }));
}
