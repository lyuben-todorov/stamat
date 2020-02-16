import IORedis = require("ioredis");
import { EventContext } from "socketio/EventContext";
import redisClient from "redis/redisClient";
import { SERVER_REPLY_MATCHUP, CLIENT_START_GAME } from "socketio/models/actions/ActionTypes";
import { ActionTypes, ServerReplyMatchup } from "socketio/models/actions/Action";
import serializeRedisMessage from "util/serializeRedisMessage";

export default function mainRedisMessageCallback(this: EventContext, channel: string, message: string) {
    this.socketLogger.info("Redis message on: " + this.userSession.sessionId.slice(-5));
    const messageObject: ActionTypes = JSON.parse(message);


    switch (type) {
        case SERVER_REPLY_MATCHUP:

            var { type, payload } = messageObject as ServerReplyMatchup;
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
            break;
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
            chess = new Chess.Chess();
            opponentId = payload.opponentInfo.opponentId
            opponentName = payload.opponentInfo.opponentName
            gameId = payload.opponentInfo.gameId;
            color = payload.color;
            socket.emit('action', { type: CLIENT_START_GAME, payload: { game: payload.game, opponentInfo: payload.opponentInfo, color: payload.color } });
            break;

        case CLIENT_SEND_CHAT_MESSAGE:
            console.log(payload);
            // message text; channel could be 'opponent', 'global', etc.; sender is either 'player' or 'server'
            socket.emit('action', { type: CLIENT_SEND_CHAT_MESSAGE, payload: { message: payload.message, channel: payload.channel, sender: "player" } });
            break;
        case CLIENT_RESUME_GAME:
            socket.emit('action', { type: CLIENT_RESUME_GAME, payload: { game: payload.game } });
            break;
        case CLIENT_OFFER_DRAW:
            socket.emit('action', { type: CLIENT_SEND_CHAT_MESSAGE, payload: { message: "Opponent is offering a draw.", channel: "opponent", sender: "server" } });
            socket.emit('action', { type: CLIENT_OFFER_DRAW, payload: { gameId: payload.gameId } });
            break;
        case CLIENT_UPDATE_GAME:
            // update socket chess instance;
            // this move has already been verified by the server
            chess.move(payload.move)
            socket.emit('action', { type: CLIENT_UPDATE_GAME, payload: payload });
            break;
        case GAME_REPLY_DRAW:
            socket.emit('action', { type: CLIENT_SEND_CHAT_MESSAGE, payload: { message: "Opponent denied draw", channel: "opponent", sender: "server" } });

            socket.emit('action', { type: CLIENT_REPLY_DRAW, payload: { reply: payload.reply } })
            break;
        // in case game isn't ended by a move
        case CLIENT_GAME_OVER:

            socket.emit('action', { type: CLIENT_GAME_OVER, payload: { winner: payload.winner } });
            flushState();

            break;
    }
}