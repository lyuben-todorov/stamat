"use strict";

var _logger = _interopRequireDefault(require("./logger"));

var _env = _interopRequireDefault(require("./env"));

var _ioredis = _interopRequireDefault(require("ioredis"));

var _clientActions = require("./clientActions");

var _redisClient = _interopRequireDefault(require("./redis/redisClient"));

var _crypto = _interopRequireDefault(require("crypto"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PORT = _env["default"].PORT || 5000;

var init = _redisClient["default"].pipeline();

init.set("regularCount", 0).set("regularCurrent", 0).set("totalCount", 0).set("totalCurrent", 0).set("gamesIssued", 0).del('matchmaking_queue').exec();
var matchmakingLogger = (0, _logger["default"])("MATCHMAKER");
var matchmakingClient = new _ioredis["default"]();

function serializeRedisMessage(type, payload) {
  return JSON.stringify({
    type: type,
    payload: payload
  });
}

function createGame(gameId, playerOne, playerTwo) {
  var startingPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  var white = Math.floor(Math.random() * 2);
  var gameObject = {
    moveCount: 0,
    issueTime: Date.now(),
    gameId: gameId,
    playerOneName: playerOne.username,
    playerTwoName: playerTwo.username,
    whiteName: white ? playerOne.username : playerTwo.username,
    blackName: white ? playerTwo.username : playerOne.username,
    playerOne: playerOne.sessionId,
    playerTwo: playerTwo.sessionId,
    playerOneColor: white ? 'w' : 'b',
    playerTwoColor: white ? 'b' : 'w',
    blackTime: 600000,
    whiteTime: 600000,
    gameTime: 600000,
    toMove: 'w',
    white: white ? playerOne.sessionId : playerTwo.sessionId,
    black: white ? playerTwo.sessionId : playerOne.sessionId,
    position: startingPosition,
    finished: false,
    winner: "none",
    history: []
  };
  return gameObject;
}

matchmakingClient.subscribe('matchmaking');
matchmakingClient.on('message', function (channel, message) {
  matchmakingLogger.info("Message:" + message);
  var messageObject = JSON.parse(message);
  var type = messageObject.type,
      payload = messageObject.payload;

  switch (type) {
    case _clientActions.MATCHMAKER_ADD_TO_QUEUE:
      var sessionId = payload.sessionId,
          username = payload.username,
          opponentType = payload.opponentType,
          mode = payload.mode,
          time = payload.time;

      if (sessionId) {
        _redisClient["default"].incr("".concat(mode, "Count"));

        _redisClient["default"].hmset(sessionId, {
          username: username,
          opponentType: opponentType,
          mode: mode,
          type: type
        });

        _redisClient["default"].sismember('matchmaking_queue', sessionId, function (err, reply) {
          if (reply) {
            _redisClient["default"].publish(sessionId, serializeRedisMessage(_clientActions.CLIENT_ALREADY_IN_QUEUE));
          } else {
            _redisClient["default"].sadd('matchmaking_queue', sessionId, function (number) {
              matchmakingLogger.info("Pushed client to MM queue:" + username);

              _redisClient["default"].smembers('matchmaking_queue', function (err, reply) {
                if (!err) {
                  // all mm logic
                  if (reply.length === 2) {
                    _redisClient["default"].srem('matchmaking_queue', reply[0], reply[1]);

                    _redisClient["default"].decrby('totalCurrent', 2);

                    _redisClient["default"].pipeline().hgetall(reply[0]).hgetall(reply[1]).exec(function (err, res) {
                      var playerOne = res[0][1];
                      var playerTwo = res[1][1];
                      matchmakingLogger.info("Proposing matchup: ".concat(playerOne.username, " vs ").concat(playerTwo.username));
                      var gameId = Math.random().toString(36).substring(2, 14) + Math.random().toString(16).substring(2, 15) + Math.random().toString(33).substring(2, 15);
                      playerOne.gameId = gameId;
                      playerTwo.gameId = gameId;
                      var game = createGame(gameId, playerOne, playerTwo);

                      _redisClient["default"].set(gameId + "object", JSON.stringify(game));

                      var opponentInfoOne = {
                        opponentId: playerTwo.sessionId,
                        opponentName: playerTwo.username,
                        gameId: gameId
                      };
                      var opponentInfoTwo = {
                        opponentId: playerOne.sessionId,
                        opponentName: playerOne.username,
                        gameId: gameId
                      };

                      _redisClient["default"].publish(playerOne.sessionId, serializeRedisMessage(_clientActions.CLIENT_START_GAME, {
                        game: game,
                        opponentInfo: opponentInfoOne,
                        color: game.playerOneColor
                      }));

                      _redisClient["default"].publish(playerTwo.sessionId, serializeRedisMessage(_clientActions.CLIENT_START_GAME, {
                        game: game,
                        opponentInfo: opponentInfoTwo,
                        color: game.playerTwoColor
                      }));
                    });
                  }
                } else {
                  matchmakingLogger.error(err);
                }
              });
            });
          }
        });
      }

      break;
  }
});