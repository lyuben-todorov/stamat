import { AUTH_REQUEST_SESSION, RESPOND_SESSION, SESSION_UNKNOWN } from "socketio/models/actions/ActionTypes";
import { SocketActionTypes } from "socketio/models/actions/SocketAction";
import { UserSession } from "socketio/models/sessions/UserSession";
import createLogger from "createLogger";
import redisClient from "redis/redisClient";
import { MatchSession } from "socketio/models/sessions/MatchSession";
import ActionBuilder from "socketio/models/actions/ActionBuilder";
import attachSocketActions from "../attachSocketActions";
import attachRedisActions from "../attachRedisActions";
import _ from 'lodash';
import { EventContext } from "socketio/EventContext";


/** 
 * This is currently deprecated. Auth logic is handled by normal http requests.
*/
export function actionCallback(this: EventContext, action: SocketActionTypes) {

    if (action.type === AUTH_REQUEST_SESSION) {

        var payload = action.payload;

        redisClient.get(payload.sessionId, (err, res) => {
            if (!err && _.isEmpty(res)) {
                this.socketLogger.info("No session to restore found");

            } else {
                var parsedUserSessionObject: UserSession = JSON.parse(res);

                this.socketLogger = createLogger(parsedUserSessionObject.sessionId);

                this.socketLogger.info("Socket session retrieved successfully");

                this.userSession = parsedUserSessionObject;

                if (parsedUserSessionObject.inMatch) {
                    parsedUserSessionObject.matchIds.forEach(matchId => {
                        console.log(matchId)
                        redisClient.get(matchId + "object", (err, reply) => {
                            var parsedMatchSessionObject: MatchSession = JSON.parse(reply);
                            this.sessionList[parsedMatchSessionObject.matchId] = parsedMatchSessionObject;
                        })
                    });
                }



                this.socket.emit('action',
                    new ActionBuilder()
                        .setType(RESPOND_SESSION)
                        .setPayload(parsedUserSessionObject)
                        .build(), () => {

                            /* once we've given the client a session we want to unsubscribe
                            our current on action event listener to avoid duplicate evens*/
                            this.socket.removeListener('action', actionCallback)

                            attachSocketActions(this.socket);
                            attachRedisActions(this.personalChannel);
                        })
            }
        })

    } else {
        this.socket.emit('action',
            new ActionBuilder()
                .setType(SESSION_UNKNOWN)
                .setPayload({})
                .build()
        )
    }
}