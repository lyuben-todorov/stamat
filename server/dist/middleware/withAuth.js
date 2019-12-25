"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _logger = _interopRequireDefault(require("../logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var logger = (0, _logger["default"])("Auth middleware");

var withAuth = function withAuth(req, res, next) {
  var token = req.cookies.token;
  logger.info(JSON.stringify(req.cookies));
  logger.info(req.user_sid);

  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    _jsonwebtoken["default"].verify(token, secret, function (err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
};

var _default = withAuth;
exports["default"] = _default;