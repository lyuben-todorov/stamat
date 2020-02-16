import { EventContext } from "socketio/EventContext";
import { SocketActionTypes } from "socketio/models/actions/SocketAction";
import _ from 'lodash'
import redisClient from "redis/redisClient";
export default function mainSocketActionCallback(this: EventContext, action: SocketActionTypes) {
    console.log("mainStamat");

    var { type, payload } = action;

    switch (type) {
        default:
            break;
    }
}