"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _logger = _interopRequireDefault(require("../logger"));

var _env = _interopRequireDefault(require("../env"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var secret = _env["default"].APP_SECRET;
var logger = (0, _logger["default"])("Auth middleware");

var withAuth = function withAuth(req, res, next) {
  var token = req.cookies.token;

  if (!token) {
    logger.error("No token");
    res.status(401).send('Unauthorized: No token provided');
  } else {
    _jsonwebtoken["default"].verify(token, secret, function (err, decoded) {
      if (err) {
        logger.error("Invalid token");
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        next();
      }
    });
  }
};

var _default = withAuth;
exports["default"] = _default;