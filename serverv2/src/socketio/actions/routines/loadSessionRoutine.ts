import { EventContext } from "../../EventContext";
import { SocketActionTypes } from "../../models/actions/SocketAction";
import { AUTH_REGISTER_ON_SOCKET, SESSION_UNKNOWN, RESPOND_SESSION } from "../../models/actions/ActionTypes";
import ActionBuilder from "../../models/actions/ActionBuilder";
import createLogger from "../../../createLogger";

export default function actionCallback(this: EventContext, action: SocketActionTypes) {
    var { type, payload } = action;

    switch (type) {

        case AUTH_REGISTER_ON_SOCKET:
            //set session here
            this.socketLogger = createLogger(payload.sessionId.slice(-5));

            this.socketLogger.info("Session registered:" + payload.sessionId.slice(-5));

            this.socket.emit('action',
                new ActionBuilder()
                    .setType(RESPOND_SESSION)
                    .setPayload({ status: "OK" })
                    .build())
            break;
        default:
            console.log(action)
            this.socket.emit('action',
                new ActionBuilder()
                    .setType(SESSION_UNKNOWN)
                    .setPayload({})
                    .build()
            )
    }
}