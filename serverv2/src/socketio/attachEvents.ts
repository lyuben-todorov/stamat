import _ from 'lodash';
import redis from "ioredis";
import { loadSessionRoutine } from './actions/routines/loadSessionRoutine';
import { Socket } from 'socket.io';
import createLogger from '../createLogger';


export default function (socket: SocketIO.Socket) {


    var logger = createLogger("Unknown")
    logger.info("Socket connected");

    var callback = loadSessionRoutine.bind({
        socket: socket,
        socketLogger: logger,
        userSession: {},
        sessionList: {},
        personalChannel: new redis(),
        sessionLoaded: false
    });
    socket.on('action', callback);
}
