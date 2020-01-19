"use strict";

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _logger = _interopRequireDefault(require("./logger"));

var _connectMongo = _interopRequireDefault(require("connect-mongo"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _cors = _interopRequireDefault(require("cors"));

var _socket = _interopRequireDefault(require("socket.io"));

var _http = _interopRequireDefault(require("http"));

var _mongoClient = _interopRequireDefault(require("./mongo/mongoClient"));

var _index = _interopRequireDefault(require("./routes/index"));

var _auth = _interopRequireDefault(require("./routes/auth"));

var _statsistics = _interopRequireDefault(require("./routes/statsistics"));

var _env = _interopRequireDefault(require("./env"));

var _clientActions = require("./clientActions");

var _redisClient = _interopRequireDefault(require("./redis/redisClient"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _chess = _interopRequireDefault(require("chess.js"));

var _ioredis = _interopRequireDefault(require("ioredis"));

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var MongoStore = (0, _connectMongo["default"])(_expressSession["default"]);
var PORT = _env["default"].PORT || 5000;
var gameLogger = (0, _logger["default"])("Game");
var serverLogger = (0, _logger["default"])("Server");
var socketLogger = (0, _logger["default"])("Socket");
var redisLogger = (0, _logger["default"])("Redis");
var matchmakingLogger = (0, _logger["default"])("Matchmaking");
app.use((0, _cors["default"])({
  credentials: true,
  origin: 'http://localhost:3000'
}));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));
app.use((0, _cookieParser["default"])());

_mongoose["default"].set('useCreateIndex', true); // Session middleware


app.use((0, _expressSession["default"])({
  secret: _env["default"].APP_SECRET,
  store: new MongoStore({
    mongooseConnection: _mongoClient["default"]
  }),
  resave: false,
  cookie: {
    maxAge: 60000
  },
  saveUninitialized: false
}));
app.use(_express["default"]["static"](_path["default"].join(__dirname, '../public'))); // Routes

app.use('/', _index["default"]);
app.use('/auth', _auth["default"]);
app.use('/statistics', _statsistics["default"]);

_redisClient["default"].set("mmqueue", 0);

_redisClient["default"].del("matchmaking_queue");
/** SOCKETS */


var server = _http["default"].createServer(app);

var io = (0, _socket["default"])(server, {
  path: "/socket"
}); // const io = socketio(server)

function serializeRedisMessage(type, payload) {
  return JSON.stringify({
    type: type,
    payload: payload
  });
}

function createGame(gameId, p1id, p2id) {
  var startingPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  var white = Math.floor(Math.random() * 2) ? p1id : p2id;
  var gameObject = {
    gameId: gameId,
    playerOne: p1id,
    playerTwo: p2id,
    white: white,
    toMove: 'w',
    position: startingPosition,
    finished: false,
    winner: "none",
    history: []
  };
  return gameObject;
}

function getHumanTime() {
  return Math.floor(Date.now() / 1000);
}

io.on("connection", function (socket) {
  var sessionId = socket.handshake.query.session; // send register as guest and boot socket

  if (_lodash["default"].isUndefined(sessionId) || sessionId == "null") {
    socket.disconnect();
    return;
  } else {
    var _socketLogger = (0, _logger["default"])(sessionId.slice(-5));

    _socketLogger.info("Socket connected");

    _redisClient["default"].hgetall(sessionId, function (err, res) {
      // var sessionObject ={
      //     chess: new Chess.Chess(),
      //     sessionId:"",
      //     clientUsername:"",
      //     gameId:"",
      //     gameObject:{},
      // }
      var chess;
      var clientUsername;
      var opponentId;
      var gameId;
      var opponentName;
      var color;
      var autoAccept = true;

      var flushState = function flushState() {
        chess = new _chess["default"].Chess();
        opponentId = "none";
        gameId = "none";
        opponentName = "none";
      };

      if (!err && _lodash["default"].isEmpty(res)) {
        _socketLogger.info("No session to restore found");
      } else {
        _socketLogger.info("Socket session retrieved successfully");

        clientUsername = res.clientUsername;
        opponentId = res.opponentId;
        gameId = res.gameId;
        opponentName = res.opponentName;
        color = res.color;

        if (res.gameId) {
          _redisClient["default"].get(res.gameId + "object", function (err, reply) {
            if (reply) {
              var gameObject = JSON.parse(reply);

              if (!gameObject.finished) {
                chess = new _chess["default"].Chess(gameObject.position);
                socket.emit('action', {
                  type: _clientActions.CLIENT_RESUME_GAME,
                  payload: {
                    game: gameObject,
                    color: color === 'w' ? 'white' : 'black'
                  }
                });
              } else {
                opponentName = "None";
                opponentId = "None";
                gameId = "none";
              }
            } else {}
          });
        }

        socket.emit('action', {
          type: _clientActions.CLIENT_RESUME_SESSION,
          payload: {
            userType: "user",
            sessionId: sessionId,
            username: clientUsername,
            opponentName: opponentName,
            gameId: gameId ? gameId : "none",
            opponentId: opponentId
          }
        });
      } //listen on personal channel for opponent


      var personalChannel = new _ioredis["default"]();
      personalChannel.subscribe(sessionId);
      personalChannel.on("message", function (channel, message) {
        redisLogger.info(" Got message: " + message);
        var messageObject = JSON.parse(message);
        var time = Date.now();
        var type = messageObject.type,
            payload = messageObject.payload;

        switch (type) {
          case _clientActions.SERVER_REPLY_MATCHUP:
            _redisClient["default"].get(gameId, function (err, reply) {
              if (err) {
                _redisClient["default"].set(gameId, 1);
              } else {
                _redisClient["default"].get(gameId, function (err, reply) {
                  matchmakingLogger.info("Matchup accepted:" + gameId);
                  matchmakingLogger.info("Waiting for players: " + reply + "/2");

                  if (reply === "2") {
                    matchmakingLogger.info("STARTED GAME:" + gameId.trim(-5));
                    var game = createGame(gameId, sessionId, opponentId);

                    _redisClient["default"].set(gameId + "object", JSON.stringify(game));

                    _redisClient["default"].publish(sessionId, serializeRedisMessage(_clientActions.CLIENT_START_GAME, {
                      game: game
                    }));

                    _redisClient["default"].publish(opponentId, serializeRedisMessage(_clientActions.CLIENT_START_GAME, {
                      game: game
                    }));
                  }
                });
              }
            });

            break;

          case _clientActions.CLIENT_PROPOSE_MATCHUP:
            if (autoAccept) {
              if (payload.playerOneUsername === clientUsername) {
                var game = createGame(payload.gameId, sessionId, payload.opponentId);
                var opponentInfo = {
                  opponentId: payload.opponentType,
                  opponentName: payload.opponentName,
                  gameId: payload.gameId
                };

                _redisClient["default"].set(payload.gameId + "object", JSON.stringify(game));

                _redisClient["default"].publish(sessionId, serializeRedisMessage(_clientActions.CLIENT_START_GAME, {
                  game: game,
                  opponentInfo: opponentInfo
                }));

                _redisClient["default"].publish(opponentId, serializeRedisMessage(_clientActions.CLIENT_START_GAME, {
                  game: game,
                  opponentInfo: opponentInfo
                }));

                matchmakingLogger.info("STARTED GAME:" + payload.gameId.trim(-5));
              }
            } else {
              matchmakingLogger.info("Proposing Matchup to " + clientUsername + " ; against " + opponentName);
              socket.emit('action', {
                type: _clientActions.CLIENT_PROPOSE_MATCHUP,
                payload: payload
              });
            }

            break;

          case _clientActions.CLIENT_START_GAME:
            chess = new _chess["default"].Chess();
            opponentId = payload.opponentInfo.opponentId;
            opponentName = payload.opponentInfo.opponentName;
            gameId = payload.opponentInfo.gameId;
            color = payload.color;
            socket.emit('action', {
              type: _clientActions.CLIENT_START_GAME,
              payload: {
                game: payload.game,
                opponentInfo: payload.opponentInfo,
                color: payload.color
              }
            });
            break;

          case _clientActions.CLIENT_SEND_CHAT_MESSAGE:
            console.log(payload); // message text; channel could be 'opponent', 'global', etc.; sender is either 'player' or 'server'

            socket.emit('action', {
              type: _clientActions.CLIENT_SEND_CHAT_MESSAGE,
              payload: {
                message: payload.message,
                channel: payload.channel,
                sender: "player"
              }
            });
            break;

          case _clientActions.CLIENT_RESUME_GAME:
            socket.emit('action', {
              type: _clientActions.CLIENT_RESUME_GAME,
              payload: {
                game: payload.game
              }
            });
            break;

          case _clientActions.CLIENT_OFFER_DRAW:
            socket.emit('action', {
              type: _clientActions.CLIENT_SEND_CHAT_MESSAGE,
              payload: {
                message: "Opponent is offering a draw.",
                channel: "opponent",
                sender: "server"
              }
            });
            socket.emit('action', {
              type: _clientActions.CLIENT_OFFER_DRAW,
              payload: {
                gameId: payload.gameId
              }
            });
            break;

          case _clientActions.CLIENT_UPDATE_GAME:
            // update socket chess instance;
            // this move has already been verified by the server
            chess.move(payload.move);
            socket.emit('action', {
              type: _clientActions.CLIENT_UPDATE_GAME,
              payload: payload
            });
            break;

          case _clientActions.GAME_REPLY_DRAW:
            socket.emit('action', {
              type: _clientActions.CLIENT_SEND_CHAT_MESSAGE,
              payload: {
                message: "Opponent denied draw",
                channel: "opponent",
                sender: "server"
              }
            });
            socket.emit('action', {
              type: _clientActions.CLIENT_REPLY_DRAW,
              payload: {
                reply: payload.reply
              }
            });
            break;
          // in case game isn't ended by a move

          case _clientActions.CLIENT_GAME_OVER:
            socket.emit('action', {
              type: _clientActions.CLIENT_GAME_OVER,
              payload: {
                winner: payload.winner
              }
            });
            flushState();
            break;
        }
      });
      socket.on('action', function (action) {
        _socketLogger.info("Recieved action on socket:" + JSON.stringify(action));

        switch (action.type) {
          case _clientActions.SERVER_START_MATCHMAKING:
            _redisClient["default"].publish('matchmaking', serializeRedisMessage(_clientActions.MATCHMAKER_ADD_TO_QUEUE, {
              opponentType: action.payload.opponentType,
              mode: action.payload.mode,
              time: action.payload.time,
              username: clientUsername,
              sessionId: sessionId,
              autoAccept: true
            }));

            break;

          case _clientActions.SERVER_REPLY_MATCHUP:
            // we don't handle rejects for now;
            if (action.payload.reply) {
              _redisClient["default"].incr(gameId);

              _redisClient["default"].publish(opponentId, serializeRedisMessage(_clientActions.SERVER_REPLY_MATCHUP, sessionId));
            }

            break;

          case _clientActions.SERVER_SEND_CHAT_MESSAGE:
            switch (action.payload.channel) {
              case "opponent":
                _redisClient["default"].publish(opponentId, serializeRedisMessage(_clientActions.CLIENT_SEND_CHAT_MESSAGE, action.payload));

                break;

              case "global":
                break;
            }

            break;

          case _clientActions.GAME_PLAYER_READY:
            // player has received game state 
            break;

          case _clientActions.GAME_PLAYER_MOVE:
            _redisClient["default"].get(action.payload.gameId + "object", function (err, reply) {
              var oldGame = JSON.parse(reply);

              if (oldGame.moveCount == 0) {
                oldGame.startTime = Date.now();
                oldGame.lastPlayerMoveTime = Date.now();
              } // player is on move
              //      XNOR


              if (oldGame.white === sessionId == (oldGame.toMove === 'w')) {
                var newMove = chess.move(action.payload.move); // is move legal;

                if (newMove === null) {
                  gameLogger.info("Client sending illegal move");
                  return;
                } // copy game object


                var newGame = oldGame;
                var moveTime = Date.now() - newGame.lastPlayerMoveTime;

                if ('w' === newGame.toMove.charAt(0)) {
                  newGame.whiteTime -= moveTime;
                } else {
                  newGame.blackTime -= moveTime;
                }

                if (newGame.whiteTime < 0 && newGame.whiteTime < newGame.blackTime) {
                  newGame.finished = true;
                  newGame.winner = newGame.white;
                } else if (newGame.blackTime < 0 && newGame.blackTime < newGame.whiteTime) {
                  newGame.finished = false;
                  newGame.winner = newGame.black;
                }

                newGame.history.push(newMove);
                newGame.moveCount += 1;
                newGame.position = chess.fen();
                newGame.toMove = newGame.toMove === 'w' ? 'b' : 'w';

                if (chess.game_over() || newGame.finished) {
                  //checkmate
                  newGame.finished = true;
                  newGame.winner = sessionId;
                  newGame.lastPlayerMoveTime = Date.now(); //send move to opponent

                  _redisClient["default"].publish(opponentId, serializeRedisMessage(_clientActions.CLIENT_UPDATE_GAME, {
                    gameId: action.payload.gameId,
                    move: action.payload.move,
                    whiteTime: newGame.whiteTime,
                    blackTime: newGame.blackTime,
                    finished: newGame.finished,
                    winner: newGame.finished ? sessionId : "none"
                  }), function () {
                    // game over shouldn't arrive before the last move 
                    _redisClient["default"].publish(newGame.playerOne, serializeRedisMessage(_clientActions.CLIENT_GAME_OVER, {
                      winner: sessionId
                    }));

                    _redisClient["default"].publish(newGame.playerTwo, serializeRedisMessage(_clientActions.CLIENT_GAME_OVER, {
                      winner: sessionId
                    }));
                  });
                } else {
                  newGame.lastPlayerMoveTime = Date.now();

                  _redisClient["default"].publish(opponentId, serializeRedisMessage(_clientActions.CLIENT_UPDATE_GAME, {
                    gameId: action.payload.gameId,
                    move: action.payload.move,
                    whiteTime: newGame.whiteTime,
                    blackTime: newGame.blackTime,
                    finished: newGame.finished,
                    winner: newGame.finished ? sessionId : "none"
                  }));
                } //set new game object


                _redisClient["default"].set(action.payload.gameId + "object", JSON.stringify(newGame));
              } else {
                console.log("no move");
              }
            });

            break;

          case _clientActions.GAME_CONCEDE:
            if (!_lodash["default"].isUndefined(gameId) && !_lodash["default"].isNull(gameId)) {
              _redisClient["default"].get(gameId + "object", function (err, reply) {
                var finishedGame = JSON.parse(reply);
                finishedGame.winner = opponentId;
                finishedGame.finished = true; // save game to static storage here;

                _redisClient["default"].set(gameId + "object", JSON.stringify(finishedGame));

                _redisClient["default"].publish(finishedGame.playerOne, serializeRedisMessage(_clientActions.CLIENT_GAME_OVER, {
                  winner: opponentId
                }));

                _redisClient["default"].publish(finishedGame.playerTwo, serializeRedisMessage(_clientActions.CLIENT_GAME_OVER, {
                  winner: opponentId
                }));
              });
            }

            break;

          case _clientActions.GAME_REPLY_DRAW:
            _redisClient["default"].get(gameId + "object", function (err, reply) {
              if (action.payload.reply) {
                var finishedGame = JSON.parse(reply);
                finishedGame.finished = true;
                finishedGame.winner = "draw"; // save game to static storage here;

                _redisClient["default"].set(gameId + "object", JSON.stringify(finishedGame));

                _redisClient["default"].publish(finishedGame.playerOne, serializeRedisMessage(_clientActions.CLIENT_GAME_OVER, {
                  winner: "draw"
                }));

                _redisClient["default"].publish(finishedGame.playerTwo, serializeRedisMessage(_clientActions.CLIENT_GAME_OVER, {
                  winner: "draw"
                }));
              } else {
                _redisClient["default"].publish(opponentId, serializeRedisMessage(_clientActions.GAME_REPLY_DRAW, {
                  reply: false
                }));
              }
            });

            break;

          case _clientActions.GAME_OFFER_DRAW:
            _redisClient["default"].get(gameId + "object", function (err, reply) {
              var currentGame = JSON.parse(reply);

              _redisClient["default"].publish(opponentId, serializeRedisMessage(_clientActions.CLIENT_OFFER_DRAW, {
                gameId: gameId
              }));
            });

            break;

          default:
            console.log(action);
        }
      });
      socket.on("disconnect", function () {
        // persist session here
        _socketLogger.info("Socket disconnected: " + sessionId); // we don't want to persist an undefined session do we


        if (!_lodash["default"].isUndefined(sessionId) && !_lodash["default"].isNull(sessionId) && sessionId !== "undefined" && sessionId !== "null") {
          var sessionObject = {
            sessionId: sessionId,
            clientUsername: clientUsername,
            gameId: gameId,
            opponentId: opponentId,
            opponentName: opponentName,
            color: color
          };

          _redisClient["default"].hmset(sessionId, sessionObject, function (err, res) {
            if (!err) {
              redisLogger.info("Session persisted successfully: ".concat(sessionId.slice(-5)));
            } else {
              redisLogger.error("Error persisting session ".concat(sessionId.slice(-5), ": ").concat(err));
            }
          });
        } // if we don't quit explicitly we run into a fun bug


        personalChannel.quit();
      });
    });
  }
});
io.on("disconnect", function () {
  socketLogger.info("Disconnected");
});
server.on("close", function () {});
server.listen(PORT, function () {
  serverLogger.info("Listening on ".concat(PORT));
});