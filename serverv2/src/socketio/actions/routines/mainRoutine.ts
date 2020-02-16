import { EventContext } from "socketio/EventContext";
import mainSocketDisconnectCallback from './mainRoutine/mainSocketDisconnectCallback';
import mainSocketActionCallback from './mainRoutine/mainSocketActionCallback';
import mainRedisMessageCallback from "./mainRoutine/mainRedisMessageCallback";

export default function mainRoutine(this: EventContext) {

    this.socket.on("disconnect", mainSocketDisconnectCallback.bind(this));
    this.socket.on('action', mainSocketActionCallback.bind(this));

    this.personalChannel.subscribe(this.userSession.sessionId);
    this.personalChannel.on('message', mainRedisMessageCallback.bind(this));

}