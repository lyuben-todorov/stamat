"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _redisClient = _interopRequireDefault(require("../redis/redisClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();
/* GET home page. */


router.get('/currentInfo', function (req, res) {});
router.get('/gamesInfo', function (req, res) {
  _redisClient["default"].keys("*object", function (err, reply) {
    var gameObjectArray = [];

    _redisClient["default"].mget(reply, function (err, arrayReply) {
      if (arrayReply) {
        arrayReply.forEach(function (element) {
          var parsedObject = JSON.parse(element);
          gameObjectArray.push(parsedObject);
        });
      }

      res.send(gameObjectArray);
    });
  });
});
var _default = router;
exports["default"] = _default;