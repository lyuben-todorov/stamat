import { EventContext } from "../../../../socketio/EventContext";
import { SERVER_REPLY_MATCHUP, CLIENT_START_GAME, CLIENT_SEND_CHAT_MESSAGE, CLIENT_RESUME_GAME, CLIENT_OFFER_DRAW, CLIENT_UPDATE_GAME, CLIENT_REPLY_DRAW, CLIENT_GAME_OVER } from "../../../../socketio/models/actions/ActionTypes";
import { RedisActionTypes, ServerReplyMatchup, ClientStartGame, ClientSendChatMessage, ClientResumeGame, ClientOfferDraw, ClientUpdateGame, ClientReplyDraw, ClientGameOver } from "../../../models/actions/RedisActionTypes";
import { Chess } from "chess.js";

export default function mainRedisMessageCallback(this: EventContext, channel: string, message: string) {
    this.socketLogger.info("Redis message on: " + this.userSession.sessionId.slice(-5));
    const messageObject: RedisActionTypes = JSON.parse(message);
    var { type } = messageObject;
    switch (type) {
        case CLIENT_START_GAME:
            {
                const { payload } = messageObject as ClientStartGame
                this.sessionList[payload.matchId] = payload;

                this.chess = new Chess();
                this.socket.emit('action', { type: CLIENT_START_GAME, payload: payload });
                break;
            }
        case CLIENT_SEND_CHAT_MESSAGE:
            {
                const { payload } = messageObject as ClientSendChatMessage
                // message text; channel could be 'opponent', 'global', etc.; sender is either 'player' or 'server'
                this.socket.emit('action', { type: CLIENT_SEND_CHAT_MESSAGE, payload: payload });
                break;
            }
        case CLIENT_RESUME_GAME:
            {
                const { payload } = messageObject as ClientResumeGame

                this.socket.emit('action', { type: CLIENT_RESUME_GAME, payload: payload });
                break;
            }
        case CLIENT_OFFER_DRAW:
            {
                const { payload } = messageObject as ClientOfferDraw
                this.socket.emit('action', { type: CLIENT_SEND_CHAT_MESSAGE, payload: { message: "Opponent is offering a draw.", channel: "opponent", sender: "server" } });
                this.socket.emit('action', { type: CLIENT_OFFER_DRAW, payload: payload });
                break;
            }
        case CLIENT_UPDATE_GAME:
            // General action for opponent moves and game changes.
            // Already verified by server
            {
                const { payload } = messageObject as ClientUpdateGame
                this.chess.move(payload.move)
                this.socket.emit('action', { type: CLIENT_UPDATE_GAME, payload: payload });
                break;

            }
        case CLIENT_REPLY_DRAW:
            {
                const { payload } = messageObject as ClientReplyDraw
                // Only sent when opponent replied with a deny. Otherwise the server just sends a GAME_OVER.
                this.socket.emit('action', { type: CLIENT_SEND_CHAT_MESSAGE, payload: { message: "Opponent denied draw", channel: "opponent", sender: "server" } });

                this.socket.emit('action', { type: CLIENT_REPLY_DRAW, payload: payload })
                break;
            }
        case CLIENT_GAME_OVER:

            {
                const { payload } = messageObject as ClientGameOver
                this.socket.emit('action', { type: CLIENT_GAME_OVER, payload: payload });
                break;
            }
    }
}