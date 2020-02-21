import { EventContext } from "../../../../socketio/EventContext";
import { ActionTypes } from "../../../../socketio/models/actions/Action";
import _ from 'lodash'
import redisClient from "../../../../redis/redisClient";
export default function mainSocketActionCallback(this: EventContext, action: ActionTypes) {

    var { type, payload } = action;

    switch (type) {
        default:
            console.log(this.userSession);
            break;
    }
}