import { EventContext } from "../../../../socketio/EventContext";
import { SocketActionTypes, ServerStartMatchmaking, ServerSendChatMessage, ServerPlayerMove, ServerConcede, ServerOfferDraw, ServerReplyDraw } from "../../../models/actions/SocketActionTypes";
import _ from 'lodash'
import redisClient from "../../../../redis/redisClient";
import { SERVER_START_MATCHMAKING, SERVER_SEND_CHAT_MESSAGE, SERVER_PLAYER_READY, SERVER_PLAYER_MOVE, CLIENT_UPDATE_GAME, CLIENT_GAME_OVER, MATCHMAKER_ADD_TO_QUEUE, SERVER_CONCEDE, SERVER_OFFER_DRAW, CLIENT_OFFER_DRAW, SERVER_REPLY_DRAW, CLIENT_REPLY_DRAW, CLIENT_SEND_CHAT_MESSAGE } from "../../../../socketio/models/actions/ActionTypes";
import serializeRedisMessage from "../../../../util/serializeRedisMessage";
import ServerMatchSession from "../../../../socketio/models/chess/ServerMatchSession";
import returnPersonalMatchSession from "../../../../util/returnPersonalMatchSession";
import PersonalMatchSession from "../../../../socketio/models/sessions/PersonalMatchSession";
import { Server } from "socket.io";
export default function mainSocketActionCallback(this: EventContext, action: SocketActionTypes) {

    this.socketLogger.info("Recieved action on socket: " + JSON.stringify(action))

    var { type } = action;
    switch (type) {
        case SERVER_START_MATCHMAKING:
            const { payload } = action as ServerStartMatchmaking;
            redisClient.publish('matchmaking', serializeRedisMessage({
                type: MATCHMAKER_ADD_TO_QUEUE, payload: payload
            }));
            break;
        case SERVER_SEND_CHAT_MESSAGE:
            {

                const { payload } = action as ServerSendChatMessage;
                switch (payload.channel) {
                    case "opponent":
                        // rework
                        console.log(this.userSession.activeGameOpponentId, serializeRedisMessage({
                            type: CLIENT_SEND_CHAT_MESSAGE,
                            payload: payload
                        }))
                        redisClient.publish(this.userSession.activeGameOpponentId, serializeRedisMessage({
                            type: CLIENT_SEND_CHAT_MESSAGE,
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
                if (payload.gameId !== "none" && !_.isUndefined(payload.gameId)) {

                    redisClient.get(payload.gameId + "object", (err, reply) => {
                        var oldGame: ServerMatchSession = JSON.parse(reply);

                        if (!oldGame.finished) {

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

                                var opponentGame = returnPersonalMatchSession(newGame, opponentId);
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
                                            newGame: opponentGame
                                        }
                                    }), () => {
                                        // game over shouldn't arrive before the last move 
                                        redisClient.publish(newGame.blackId, serializeRedisMessage({
                                            type: CLIENT_GAME_OVER, payload: {
                                                winner: newGame.winner,
                                                game: returnPersonalMatchSession(newGame, newGame.blackId)
                                            }
                                        }));
                                        redisClient.publish(newGame.whiteId, serializeRedisMessage({
                                            type: CLIENT_GAME_OVER, payload: {
                                                winner: newGame.winner,
                                                game: returnPersonalMatchSession(newGame, newGame.whiteId)
                                            }
                                        }));

                                    });

                                } else {
                                    // isn't over;
                                    redisClient.publish(opponentId, serializeRedisMessage({
                                        type: CLIENT_UPDATE_GAME,
                                        payload:
                                        {
                                            gameId: payload.gameId,
                                            move: payload.move,
                                            newGame: opponentGame
                                        }
                                    }));
                                }
                                //set new game object
                                redisClient.set(payload.gameId + "object", JSON.stringify(newGame))

                            }
                        } else {
                            // send bad message response.
                        }

                    })
                } else {
                    // send bad message response.
                }
            }
            break;

        case SERVER_CONCEDE:
            {
                const { payload } = action as ServerConcede;

                if (!_.isUndefined(payload.gameId) && !_.isNull(payload.gameId)) {

                    redisClient.get(payload.gameId + "object", (err, reply: string) => {
                        var finishedGame: ServerMatchSession = JSON.parse(reply);

                        console.log(this.sessionList);
                        console.log(this.userSession.activeGameId);
                        finishedGame.winner = this.sessionList[this.userSession.activeGameId].opponent.name;
                        finishedGame.finished = true;
                        // save game to static storage here;
                        redisClient.set(payload.gameId + "object", JSON.stringify(finishedGame));

                        redisClient.publish(finishedGame.whiteId, serializeRedisMessage({
                            type: CLIENT_GAME_OVER,
                            payload: {
                                winner: finishedGame.winner,
                                game: returnPersonalMatchSession(finishedGame, finishedGame.whiteId)
                            }
                        }));
                        redisClient.publish(finishedGame.blackId, serializeRedisMessage({
                            type: CLIENT_GAME_OVER,
                            payload: {
                                winner: finishedGame.winner,
                                game: returnPersonalMatchSession(finishedGame, finishedGame.blackId)
                            }
                        }));

                    })
                }
            }
            break;
        case SERVER_OFFER_DRAW:
            {
                const { payload } = action as ServerOfferDraw;

                if (this.userSession.activeGameOpponentId) {
                    redisClient.publish(this.userSession.activeGameOpponentId, serializeRedisMessage({ type: CLIENT_OFFER_DRAW, payload: { gameId: payload.gameId } }));
                }

            }
            break;
        case SERVER_REPLY_DRAW:
            {
                const { payload } = action as ServerReplyDraw;

                redisClient.get(payload.gameId + "object", (err, reply) => {
                    if (payload.reply) {
                        var finishedGame: ServerMatchSession = JSON.parse(reply)
                        finishedGame.finished = true;
                        finishedGame.winner = "draw";
                        // save game to static storage here;
                        redisClient.set(payload.gameId + "object", JSON.stringify(finishedGame));
                        redisClient.publish(finishedGame.whiteId, serializeRedisMessage({
                            type: CLIENT_GAME_OVER, payload: {
                                winner: "draw",
                                game: returnPersonalMatchSession(finishedGame, finishedGame.whiteId)
                            }
                        }));
                        redisClient.publish(finishedGame.blackId, serializeRedisMessage({
                            type: CLIENT_GAME_OVER, payload: {
                                winner: "draw",
                                game: returnPersonalMatchSession(finishedGame, finishedGame.blackId)
                            }
                        }));

                    } else {
                        redisClient.publish(this.userSession.activeGameOpponentId, serializeRedisMessage({ type: CLIENT_REPLY_DRAW, payload: { reply: false } }));
                    }
                })
            }
            break;

        default:
            console.log(action);
    }
}