"use strict";

var _logger = _interopRequireDefault(require("./logger"));

var _env = _interopRequireDefault(require("./env"));

var _redis = _interopRequireDefault(require("redis"));

var _clientActions = require("./clientActions");

var _redisClient = _interopRequireDefault(require("./redis/redisClient"));

var _crypto = _interopRequireDefault(require("crypto"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PORT = _env["default"].PORT || 5000;
var matchmakingLogger = (0, _logger["default"])("MATCHMAKER");

var matchmakingClient = _redis["default"].createClient();

function serializeRedisMessage(type, payload) {
  return JSON.stringify({
    type: type,
    payload: payload
  });
}

_redisClient["default"].del('matchmaking_queue');

matchmakingClient.subscribe('matchmaking');
matchmakingClient.on('message', function (channel, message) {
  matchmakingLogger.info("Message:" + message);
  var messageObject = JSON.parse(message);
  var type = messageObject.type,
      payload = messageObject.payload;

  switch (type) {
    case _clientActions.MATCHMAKER_ADD_TO_QUEUE:
      var sessionId = payload.sessionId,
          username = payload.username;
      var serializedObject = JSON.stringify(payload);
      matchmakingLogger.info(serializedObject);

      _redisClient["default"].sismember('matchmaking_queue', serializedObject, function (err, reply) {
        if (reply) {
          _redisClient["default"].publish(sessionId, serializeRedisMessage(_clientActions.CLIENT_ALREADY_IN_QUEUE));
        } else {
          _redisClient["default"].sadd('matchmaking_queue', serializedObject, function (number) {
            matchmakingLogger.info("Pushed client to MM queue:" + username);

            _redisClient["default"].smembers('matchmaking_queue', function (err, reply) {
              if (!err) {
                // all mm logic
                if (reply.length === 2) {
                  _redisClient["default"].SREM('matchmaking_queue', reply[0], reply[1]);

                  var playerOne = JSON.parse(reply[0]);
                  var playerTwo = JSON.parse(reply[1]);
                  matchmakingLogger.info("Proposing matchup: ".concat(playerOne.username, " vs ").concat(playerTwo.username));
                  var gameId = Math.random().toString(36).substring(2, 14) + Math.random().toString(16).substring(2, 15) + Math.random().toString(33).substring(2, 15);
                  playerOne.gameId = gameId;
                  playerTwo.gameId = gameId;
                  console.log(playerTwo);
                  console.log(playerOne);

                  _redisClient["default"].publish(playerOne.sessionId, serializeRedisMessage(_clientActions.CLIENT_PROPOSE_MATCHUP, playerTwo));

                  _redisClient["default"].publish(playerTwo.sessionId, serializeRedisMessage(_clientActions.CLIENT_PROPOSE_MATCHUP, playerOne));
                }
              } else {
                matchmakingLogger.error(err);
              }
            });
          });
        }
      });

      break;
  }
});