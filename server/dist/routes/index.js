"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _redisClient = _interopRequireDefault(require("../redis/redisClient"));

var _mongoClient = _interopRequireDefault(require("../mongo/mongoClient"));

var _withAuth = _interopRequireDefault(require("../middleware/withAuth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();
/* GET home page. */


router.get('/checkToken', _withAuth["default"], function (req, res) {
  res.status(200).send("yeees");
});
var _default = router;
exports["default"] = _default;