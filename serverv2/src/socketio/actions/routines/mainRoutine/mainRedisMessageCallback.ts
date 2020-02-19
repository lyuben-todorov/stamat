import { EventContext } from "../../../../socketio/EventContext";
import redisClient from "../../../../redis/redisClient";
import { SERVER_REPLY_MATCHUP, CLIENT_START_GAME, CLIENT_SEND_CHAT_MESSAGE, CLIENT_RESUME_GAME, CLIENT_OFFER_DRAW, CLIENT_UPDATE_GAME, CLIENT_REPLY_DRAW, CLIENT_GAME_OVER } from "../../../../socketio/models/actions/ActionTypes";
import { ActionTypes, ServerReplyMatchup, ClientStartGame, ClientSendChatMessage, ClientResumeGame, ClientOfferDraw, ClientUpdateGame, ClientReplyDraw, ClientGameOver } from "../../../../socketio/models/actions/Action";

export default function mainRedisMessageCallback(this: EventContext, channel: string, message: string) {
    this.socketLogger.info("Redis message on: " + this.userSession.sessionId.slice(-5));
    const messageObject: ActionTypes = JSON.parse(message);

    var { type } = messageObject;
    switch (type) {
        // case CLIENT_PROPOSE_MATCHUP:
        //     if (autoAccept) {
        //         if (payload.playerOneUsername === clientUsername) {

        //             let game = createGame(payload.gameId, sessionId, payload.opponentId);
        //             let opponentInfo = {
        //                 opponentId: payload.opponentType,
        //                 opponentName: payload.opponentName,
        //                 gameId: payload.gameId
        //             }
        //             redisClient.set(payload.gameId + "object", JSON.stringify(game));


        //             redisClient.publish(sessionId, serializeRedisMessage(CLIENT_START_GAME, { game, opponentInfo }));
        //             redisClient.publish(opponentId, serializeRedisMessage(CLIENT_START_GAME, { game, opponentInfo }));

        //             matchmakingLogger.info("STARTED GAME:" + payload.gameId.trim(-5))
        //         }

        //     } else {

        //         matchmakingLogger.info("Proposing Matchup to " + clientUsername + " ; against " + opponentName);

        //         socket.emit('action', { type: CLIENT_PROPOSE_MATCHUP, payload: payload })
        //     }
        //     break;
        case CLIENT_START_GAME:
            {
                const { payload } = messageObject as ClientStartGame

                this.sessionList[payload.matchId] = payload;

                this.socket.emit('action', { type: CLIENT_START_GAME, payload: payload });
                break;
            }
        case SERVER_REPLY_MATCHUP:
            {
                const { payload } = messageObject as ServerReplyMatchup

                const queueId = `${payload.matchId}-queue`;
                redisClient.get(queueId, (err, reply) => {
                    if (err) {
                        this.socketLogger.error("Client tried to respond to a game that doesn't exist")
                    } else {

                        redisClient.get(queueId, (err, reply) => {
                            this.socketLogger.info(`Matchup accepted: ${payload.matchId}`)
                            this.socketLogger.info(`Waiting for players: ${reply}/2`);
                            if (reply === '2') {
                                this.socketLogger.info(`STARTED GAME: ${payload.matchId.slice(-5)}`)

                                // redisClient.publish(this.userSession.sessionId, serializeRedisMessage({type:CLIENT_START_GAME, payload:{}}));
                                // redisClient.publish(opponentId, serializeRedisMessage(CLIENT_START_GAME, { game: game, }));
                            }
                        })
                    }
                })
            }
            break;
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
                this.socket.emit('action', { type: CLIENT_OFFER_DRAW, payload: payload});
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