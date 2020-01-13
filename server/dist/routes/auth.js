"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _logger = _interopRequireDefault(require("../logger"));

var _jsonwebtoken = _interopRequireWildcard(require("jsonwebtoken"));

var _User = _interopRequireDefault(require("../mongo/models/User"));

var _env = _interopRequireDefault(require("../env"));

var _winston = require("winston");

var _redisClient = _interopRequireDefault(require("../redis/redisClient"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var secret = _env["default"].APP_SECRET;
var logger = (0, _logger["default"])("User Authentication");

var router = _express["default"].Router();
/* GET home page. */


router.post('/register', function (req, res) {
  var _req$body = req.body,
      email = _req$body.email,
      password = _req$body.password,
      username = _req$body.username;
  var user = new _User["default"]({
    email: email,
    password: password,
    username: username
  });
  user.save(function (err) {
    if (err) {
      logger.error(err);
      res.status(409).send({
        emailError: true
      });
    } else {
      logger.info("Registered user: " + email);
      res.status(200).send("Welcome to the club!");
    }
  });
}); // used to restore user session
// client sends request with auth cookies
// if the token is valid the server tries to retrieve session 
// if there is a session the cookie session is sent
// otherwise a new session is generated
// sessions are redis-instance specific as they don't get persisted to static storage (mongodb)
// note: this is only used to restore the token itself. Data such as game state is restored on it's own through sockets.

router.get('/restore', function (req, res) {
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
        var email = decoded.email;

        _User["default"].findOne({
          email: email
        }, function (err, user) {
          var email = user.email,
              username = user.username,
              _id = user._id;

          var id = _id.toString();

          _redisClient["default"].get(id, function (err, reply) {
            var sessionId = reply; //no session for user found

            if (!reply) {
              // make new session id
              sessionId = _jsonwebtoken["default"].sign({
                username: username
              }, secret);

              _redisClient["default"].set(id, sessionId);
            }

            res.cookie('sessionId', sessionId).send({
              email: email,
              username: username,
              id: id,
              sessionId: sessionId
            });
          });
        });
      }
    });
  }
});
router.post('/login', function (req, res) {
  var _req$body2 = req.body,
      email = _req$body2.email,
      password = _req$body2.password;

  _User["default"].findOne({
    email: email
  }, function (err, user) {
    if (err) {
      console.error(err);
      res.status(500).json({
        error: 'Internal error please try again'
      });
    } else if (!user) {
      res.status(401).json({
        error: 'Incorrect email or password'
      });
    } else {
      user.comparePassword(password, function (err, isMatch) {
        if (err) {
          res.status(500).json({
            error: 'Internal error please try again'
          });
        } else if (!isMatch) {
          res.status(401).send('wrong creds');
        } else {
          // Issue token
          var token = _jsonwebtoken["default"].sign({
            email: user.email
          }, secret);

          var _email = user.email,
              username = user.username,
              _id = user._id;

          var id = _id.toString();

          _redisClient["default"].get(id, function (err, reply) {
            var sessionId;

            if (reply) {
              sessionId = reply;
            } else {
              sessionId = _jsonwebtoken["default"].sign({
                username: username
              }, secret);

              _redisClient["default"].set(user._id.toString(), sessionId);
            }

            res.cookie('token', token, {
              httpOnly: true
            }).cookie('sessionId', sessionId).send({
              email: _email,
              username: username,
              id: id,
              sessionId: sessionId
            }); // we send the sessionid as it is useless without the securely-issued token cookie anyway
          });
        }
      });
    }
  });
});
router.get('/logout', function (req, res) {
  res.clearCookie('token').clearCookie('sessionId').sendStatus(200);
});
var _default = router;
exports["default"] = _default;