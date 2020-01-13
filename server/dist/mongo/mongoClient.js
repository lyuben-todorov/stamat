"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _logger = _interopRequireDefault(require("../logger"));

var _env = _interopRequireDefault(require("../env"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var logger = (0, _logger["default"])('MongoDB');
var uri = "mongodb://".concat(_env["default"].MONGO_USERNAME, ":").concat(_env["default"].MONGO_PASSWORD).concat(_env["default"].MONGO_USERNAME ? "@" : "", "localhost:27017/ebredebre");
console.log(uri);
var db = _mongoose["default"].connection;
db.on('error', function (error) {
  logger.error('Error in MongoDb connection: ' + error);

  _mongoose["default"].disconnect();
});
db.once('open', function () {
  logger.info('MongoDB connection opened!');
});
db.on('reconnected', function () {
  logger.info('Established MongoDB connection!');
});
db.on('disconnected', function () {
  logger.info('MongoDB disconnected!');
});

_mongoose["default"].connect(uri, {
  autoReconnect: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var connection = _mongoose["default"].connection;
var _default = connection;
exports["default"] = _default;