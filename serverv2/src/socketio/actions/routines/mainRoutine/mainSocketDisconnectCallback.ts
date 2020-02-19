import { EventContext } from "../../../../socketio/EventContext";
import redisClient from "../../../../redis/redisClient";
import _ from 'lodash'
export default function mainSocketDisconnectCallback(this: EventContext) {
    // persist session here
    this.socketLogger.info("Socket disconnected: " + this.userSession.sessionId.slice(-5));

    // we don't want to persist an undefined session do we
    if (!_.isUndefined(this.userSession.sessionId) && !_.isNull(this.userSession.sessionId) &&
        this.userSession.sessionId !== "undefined" && this.userSession.sessionId !== "null") {

        var serializedSessionObject = JSON.stringify(this.userSession)
        redisClient.set(this.userSession.sessionId, serializedSessionObject, (err, res) => {
            if (!err) {
                this.socketLogger.info(`Session persisted successfully: ${this.userSession.sessionId.slice(-5)}`);

            } else {
                this.socketLogger.error(`Error persisting session ${this.userSession.sessionId.slice(-5)}: ${err}`)
            }
        })
    }
    // quit redis subscription
    this.personalChannel.quit()
}