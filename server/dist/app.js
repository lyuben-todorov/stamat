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

var _env = _interopRequireDefault(require("./env"));

var _clientActions = require("./clientActions");

var _redisClient = _interopRequireDefault(require("./redis/redisClient"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _chess = _interopRequireDefault(require("chess.js"));

var _ioredis = _interopRequireDefault(require("ioredis"));

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

_redisClient["default"].set("mmqueue", 0);

_redisClient["default"].del("matchmaking_queue");
/** SOCKETS */


var server = _http["default"].createServer(app);

var io = (0, _socket["default"])(server);

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

io.on("connection", function (socket) {
  var sessionId = socket.handshake.query.session;
  var socketLogger = (0, _logger["default"])(sessionId.slice(-5));
  socketLogger.info("Socket connected");

  _redisClient["default"].hgetall(sessionId, function (err, res) {
    var chess;
    var clientUsername;
    var opponentId;
    var gameId;
    var opponentName;

    if (!err && err !== null) {
      socketLogger.info("No session found" + err);
    } else {
      socketLogger.info("Socket session retrieved successfully");
      clientUsername = res.clientUsername;
      opponentId = res.opponentId;
      gameId = res.gameId;
      opponentName = res.opponentName;
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

      if (res.gameId) {
        _redisClient["default"].get(res.gameId + "object", function (err, reply) {
          var gameObject = JSON.parse(reply);

          if (!gameObject.finished) {
            chess = new _chess["default"].Chess(gameObject.position); // write socket action payloads in a verbose way for code readability
            // not payload: { ... , ... , .. } or payload: payload

            socket.emit('action', {
              type: _clientActions.CLIENT_RESUME_GAME,
              payload: {
                game: gameObject
              }
            });
          }
        });
      }
    } //listen on personal channel for opponent


    var personalChannel = new _ioredis["default"]();
    personalChannel.subscribe(sessionId);
    personalChannel.on("message", function (channel, message) {
      redisLogger.info(" Got message: " + message);
      var messageObject = JSON.parse(message);
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
          gameId = payload.gameId;
          opponentId = payload.sessionId;
          opponentName = payload.username;
          matchmakingLogger.info("Proposing Matchup to " + clientUsername + " ; against " + opponentName);
          socket.emit('action', {
            type: _clientActions.CLIENT_PROPOSE_MATCHUP,
            payload: payload
          });
          break;

        case _clientActions.CLIENT_START_GAME:
          chess = new _chess["default"].Chess();
          socket.emit('action', {
            type: _clientActions.CLIENT_START_GAME,
            payload: {
              game: payload.game
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

        case _clientActions.CLIENT_UPDATE_GAME:
          // update socket chess instance;
          chess.move(payload.move);
          socket.emit('action', {
            type: _clientActions.CLIENT_UPDATE_GAME,
            payload: payload
          });

          if (payload.finished && chess.game_over()) {
            socket.emit('action', {
              type: _clientActions.CLIENT_GAME_OVER,
              payload: {
                winner: payload.winner
              }
            });
          }

          break;
        // in case game isn't ended by a move

        case _clientActions.CLIENT_GAME_OVER:
          socket.emit('action', {
            type: _clientActions.CLIENT_GAME_OVER,
            payload: {
              winner: payload.winner
            }
          });
          break;
      }
    });
    socket.on("disconnect", function () {
      // persist session here
      socketLogger.info("Socket disconnected");
      var sessionObject = {
        sessionId: sessionId,
        clientUsername: clientUsername,
        gameId: gameId,
        opponentId: opponentId,
        opponentName: opponentName
      };

      _redisClient["default"].hmset(sessionId, sessionObject, function (err, res) {
        if (!err) {
          redisLogger.info("Session persisted successfully: ".concat(sessionId.slice(-5)));
        } else {
          redisLogger.error("Error persisting session ".concat(sessionId.slice(-5), ": ").concat(err));
        }
      }); // if we don't quit explicitly we run into a fun bug


      personalChannel.quit();
    });
    socket.on('action', function (action) {
      socketLogger.info("Recieved action on socket:" + JSON.stringify(action));

      switch (action.type) {
        case _clientActions.SERVER_START_MATCHMAKING:
          clientUsername = action.payload.username;

          _redisClient["default"].publish('matchmaking', serializeRedisMessage(_clientActions.MATCHMAKER_ADD_TO_QUEUE, {
            "username": action.payload.username,
            "sessionId": action.payload.sessionId
          }));

          break;

        case _clientActions.SERVER_REPLY_MATCHUP:
          // we don't handle rejects for now;
          if (action.payload.reply) {
            _redisClient["default"].incr(gameId);

            _redisClient["default"].publish(opponentId, serializeRedisMessage(_clientActions.SERVER_REPLY_MATCHUP, sessionId));
          }

          break;

        case _clientActions.GAME_PLAYER_READY:
          // player has received game state 
          break;

        case _clientActions.GAME_PLAYER_MOVE:
          _redisClient["default"].get(action.payload.gameId + "object", function (err, reply) {
            var oldGame = JSON.parse(reply); // player is on move
            //      XNOR

            if (oldGame.white === sessionId == (oldGame.toMove === 'w')) {
              var newMove = chess.move(action.payload.move); // is move legal;

              if (newMove === null) {
                gameLogger.info("Client sending illegal move");
                return;
              } // copy game object


              var newGame = oldGame;
              newGame.history.push(newMove);
              newGame.position = chess.fen();
              newGame.toMove = newGame.toMove === 'w' ? 'b' : 'w';

              if (chess.game_over()) {
                //checkmate
                newGame.finished = true;
                newGame.winner = sessionId;
                socket.emit('action', {
                  type: _clientActions.CLIENT_GAME_OVER,
                  payload: {
                    winner: sessionId
                  }
                });
              } //set new game object


              _redisClient["default"].set(action.payload.gameId + "object", JSON.stringify(newGame));

              _redisClient["default"].publish(opponentId, serializeRedisMessage(_clientActions.CLIENT_UPDATE_GAME, {
                gameId: action.payload.gameId,
                move: action.payload.move,
                finished: newGame.finished,
                winner: newGame.finished ? sessionId : "none"
              }));
            } else {
              console.log("no move");
            }
          });

          break;

        case _clientActions.GAME_CONCEDE:
          _redisClient["default"].get(gameId + "object", function (err, reply) {
            var finishedGame = JSON.parse(reply);
            finishedGame.finished = true; // save game to static storage here;

            _redisClient["default"].set(gameId + "object", JSON.stringify(finishedGame));

            _redisClient["default"].publish(finishedGame.playerOne, serializeRedisMessage(_clientActions.CLIENT_GAME_OVER, {
              winner: opponentId
            }));

            _redisClient["default"].publish(finishedGame.playerTwo, serializeRedisMessage(_clientActions.CLIENT_GAME_OVER, {
              winner: opponentId
            }));
          });

          break;

        case _clientActions.GAME_OFFER_DRAW:
          break;

        default:
          console.log(action);
      }
    });
  });
});
io.on("disconnect", function () {
  socketLogger.info("Disconnected");
});
server.on("close", function () {});
server.listen(PORT, function () {
  serverLogger.info("Listening on ".concat(PORT));
});