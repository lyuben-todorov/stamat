import * as io from 'socket.io-client';

export const rootSocket = io('http://localhost:3001');