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
      req.session.sessid = email;
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
      logger.error(err);
      res.statusCode = 500;
      res.send();
    }

    if (!user) {
      logger.error("User not found");
      res.statusCode = 401;
      res.send();
    } else {
      // test a matching password
      user.comparePassword(password, function (err, isMatch) {
        if (err) {
          logger.error(err);
          res.statusCode(404).send();
        }

        if (!isMatch) {
          logger.error("Wrong password");
          res.statusCode(403).send();
        } else {
          logger.info("User logged in:" + email);
          req.session.sessid = email;
          res.cookie('sessid', email);
          res.status(200);
        }
      });
    }
  });
});
var _default = router;
exports["default"] = _default;