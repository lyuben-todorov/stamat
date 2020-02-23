import { EventContext } from "../../../../socketio/EventContext";
import { SocketActionTypes, ServerStartMatchmaking, ServerSendChatMessage, ServerPlayerMove, ServerPlayerReady } from "../../../models/actions/SocketActionTypes";
import _ from 'lodash'
import redisClient from "../../../../redis/redisClient";
import { SERVER_START_MATCHMAKING, SERVER_SEND_CHAT_MESSAGE, SERVER_PLAYER_READY, SERVER_PLAYER_MOVE, CLIENT_UPDATE_GAME, CLIENT_GAME_OVER } from "../../../../socketio/models/actions/ActionTypes";
import serializeRedisMessage from "../../../../util/serializeRedisMessage";
import ServerMatchSession from "../../../../socketio/models/chess/ServerMatchSession";
import returnPersonalMatchSession from "../../../../util/returnPersonalMatchSession";
import PersonalMatchSession from "../../../../socketio/models/sessions/PersonalMatchSession";
export default function mainSocketActionCallback(this: EventContext, action: SocketActionTypes) {

    this.socketLogger.info("Recieved action on socket: " + JSON.stringify(action))

    var { type } = action;
    switch (type) {
        case SERVER_START_MATCHMAKING:
            const { payload } = action as ServerStartMatchmaking;
            redisClient.publish('matchmaking', serializeRedisMessage({
                type: SERVER_START_MATCHMAKING, payload: payload
            }));
            break;
        case SERVER_SEND_CHAT_MESSAGE:
            {

                const { payload } = action as ServerSendChatMessage;
                switch (payload.channel) {
                    case "opponent":
                        // rework
                        redisClient.publish(this.activeGame.opponent.name, serializeRedisMessage({
                            type: SERVER_SEND_CHAT_MESSAGE,
                            payload: payload
                        }));
                        break;
                    case "global":
                        break;
                }
                break;
            }

        case SERVER_PLAYER_READY:
            // player has received game state 
            break;
        case SERVER_PLAYER_MOVE:
            {

                const { payload } = action as ServerPlayerMove;
                redisClient.get(payload.gameId + "object", (err, reply) => {
                    var oldGame: ServerMatchSession = JSON.parse(reply);

                    var currentUserMatchSession: PersonalMatchSession = returnPersonalMatchSession(oldGame, this.userSession.sessionId);

                    var opponentId = oldGame.whiteId === this.userSession.sessionId ? oldGame.blackId : oldGame.whiteId;
                    if (currentUserMatchSession.moveCount == 0) {
                        oldGame.startTime = Date.now();
                        oldGame.lastPlayerMoveTime = Date.now();
                    }
                    // player is on move
                    if (currentUserMatchSession.proponent.color === oldGame.onMove) {
                        var newMove = this.chess.move(payload.move);
                        // is move legal;
                        if (newMove === null) {
                            this.socketLogger.info("Client sending illegal move")
                            return;
                        }

                        // copy game object
                        var newGame = oldGame;
                        var moveTime = Date.now() - newGame.lastPlayerMoveTime;
                        newGame.lastPlayerMoveTime = Date.now()

                        if (newGame.onMove === "white") {
                            newGame.white.timeLeft -= moveTime
                        } else {
                            newGame.black.timeLeft -= moveTime;
                        }

                        if (newGame.white.timeLeft < 0 && newGame.white.timeLeft < newGame.black.timeLeft) {

                            newGame.finished = true;
                            newGame.winner = newGame.whiteId;

                        } else if (newGame.black.timeLeft < 0 && newGame.black.timeLeft < newGame.white.timeLeft) {
                            newGame.finished = true;
                            newGame.winner = newGame.blackId;
                        }

                        newGame.moveHistory.push(newMove)
                        newGame.moveCount += 1;
                        newGame.position = this.chess.fen();
                        newGame.onMove = newGame.onMove === "white" ? "black" : "white";

                        // is over
                        if (this.chess.game_over() || newGame.finished) {
                            //checkmate
                            newGame.finished = true;
                            if (newGame.winner === "none") {
                                newGame.winner = this.userSession.username;
                            }

                            //send move to opponent
                            redisClient.publish(opponentId, serializeRedisMessage({
                                type: CLIENT_UPDATE_GAME,
                                payload:
                                {
                                    gameId: payload.gameId,
                                    move: payload.move,
                                    whiteTime: newGame.white.timeLeft,
                                    blackTime: newGame.black.timeLeft,
                                    finished: newGame.finished,
                                    winner: newGame.winner
                                }
                            }), () => {
                                // game over shouldn't arrive before the last move 
                                redisClient.publish(newGame.blackId, serializeRedisMessage({ type: CLIENT_GAME_OVER, payload: { winner: newGame.winner } }));
                                redisClient.publish(newGame.whiteId, serializeRedisMessage({ type: CLIENT_GAME_OVER, payload: { winner: newGame.winner } }));

                            });

                        } else {
                            // isn't over;
                            redisClient.publish(opponentId, serializeRedisMessage({
                                type: CLIENT_UPDATE_GAME,
                                payload:
                                {
                                    gameId: payload.gameId,
                                    move: payload.move,
                                    whiteTime: newGame.white.timeLeft,
                                    blackTime: newGame.black.timeLeft,
                                    finished: false,
                                    winner: "none"
                                }
                            }));
                        }
                        //set new game object
                        redisClient.set(payload.gameId + "object", JSON.stringify(newGame))

                    }
                })
                break;
            }
        // case GAME_CONCEDE:
        //     if(!_.isUndefined(gameId) && !_.isNull(gameId)){

        //         redisClient.get(gameId + "object", (err, reply) => {
        //             let finishedGame = JSON.parse(reply)
        //             finishedGame.winner = opponentId;
        //             finishedGame.finished = true;
        //             // save game to static storage here;
        //             redisClient.set(gameId + "object", JSON.stringify(finishedGame));
        //             redisClient.publish(finishedGame.playerOne, serializeRedisMessage(CLIENT_GAME_OVER, { winner: opponentId }));
        //             redisClient.publish(finishedGame.playerTwo, serializeRedisMessage(CLIENT_GAME_OVER, { winner: opponentId }));

        //         })
        //     }
        //     break;
        // case GAME_REPLY_DRAW:
        //     redisClient.get(gameId + "object", (err, reply) => {
        //         if (action.payload.reply) {
        //             let finishedGame = JSON.parse(reply)
        //             finishedGame.finished = true;
        //             finishedGame.winner = "draw";
        //             // save game to static storage here;
        //             redisClient.set(gameId + "object", JSON.stringify(finishedGame));
        //             redisClient.publish(finishedGame.playerOne, serializeRedisMessage(CLIENT_GAME_OVER, { winner: "draw" }));
        //             redisClient.publish(finishedGame.playerTwo, serializeRedisMessage(CLIENT_GAME_OVER, { winner: "draw" }));

        //         } else {
        //             redisClient.publish(opponentId, serializeRedisMessage(GAME_REPLY_DRAW, { reply: false }));
        //         }
        //     })
        //     break;
        // case GAME_OFFER_DRAW:
        //     redisClient.get(gameId + "object", (err, reply) => {
        //         let currentGame = JSON.parse(reply)

        //         redisClient.publish(opponentId, serializeRedisMessage(CLIENT_OFFER_DRAW, { gameId: gameId }));

        //     })
        //     break;
        // default:
        //     console.log(action);
    }
}