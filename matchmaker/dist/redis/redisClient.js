"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _redis = _interopRequireDefault(require("redis"));

var _logger = _interopRequireDefault(require("../logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var logger = (0, _logger["default"])('Matchmaking Redis');

var redisClient = _redis["default"].createClient();

redisClient.on("error", function (err) {
  logger.error("Redis error: " + err);
});
redisClient.on("ready", function () {
  logger.info("Redis connection opened!");
});
var _default = redisClient;
exports["default"] = _default;