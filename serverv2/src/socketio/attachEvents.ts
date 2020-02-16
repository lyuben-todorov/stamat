import _ from 'lodash';
import redis from "ioredis";
import { serverLogger } from '../server'
import loadSessionRoutine from './actions/routines/loadSessionRoutine';
import { Socket } from 'socket.io';


export default function (io: SocketIO.Server) {

    io.on("connection", function actionCallback(socket: Socket) {

        this.socket = socket;
        this.socketLogger.info("Socket connected");

        socket.on('action', loadSessionRoutine.bind(this));

        // This bind here is critical. This is where we supply our further functions with this context.
        // This is done for code separation and readablity  
    }.bind({
        socketLogger: serverLogger,
        userSession: {},
        sessionList: {},
        personalChannel: new redis(),
        sessionLoaded: false
    }));
}
