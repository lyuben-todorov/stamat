import * as io from 'socket.io-client';
import procVars from '../procVars';

export const rootSocket = io(procVars.socketUrl);