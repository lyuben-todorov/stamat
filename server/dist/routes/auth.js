"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _logger = _interopRequireDefault(require("../logger"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _User = _interopRequireDefault(require("../mongo/models/User"));

var _env = _interopRequireDefault(require("../env"));

var _winston = require("winston");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var secret = _env["default"].APP_SECRET;
var logger = (0, _logger["default"])("User Authentication");

var router = _express["default"].Router();
/* GET home page. */


router.post('/register', function (req, res) {
  var _req$body = req.body,
      email = _req$body.email,
      password = _req$body.password;
  var user = new _User["default"]({
    email: email,
    password: password
  });
  user.save(function (err) {
    if (err) {
      logger.error(err);
      res.status(500).send("Error registering new user please try again.");
    } else {
      logger.info("Registered user: " + email);
      res.status(200).send("Welcome to the club!");
    }
  });
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
          res.sendStatus(401);
        } else {
          // Issue token
          var payload = {
            email: email
          };

          var token = _jsonwebtoken["default"].sign(payload, secret, {
            expiresIn: '1h'
          });

          res.cookie('token', token, {
            httpOnly: true
          }).sendStatus(200);
        }
      });
    }
  });
});
router.get('/logout', function (req, res) {
  res.clearCookie('token').sendStatus(200);
});
var _default = router;
exports["default"] = _default;