"use strict";

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _morgan = _interopRequireDefault(require("morgan"));

var _connectMongo = _interopRequireDefault(require("connect-mongo"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _cors = _interopRequireDefault(require("cors"));

var _mongoClient = _interopRequireDefault(require("./mongo/mongoClient"));

var _index = _interopRequireDefault(require("./routes/index"));

var _auth = _interopRequireDefault(require("./routes/auth"));

var _env = _interopRequireDefault(require("./env"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var MongoStore = (0, _connectMongo["default"])(_expressSession["default"]);
var PORT = _env["default"].PORT || 5000;
app.use((0, _cors["default"])({
  credentials: true,
  origin: 'http://localhost:3000'
}));
app.use((0, _morgan["default"])('dev'));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));
app.use((0, _cookieParser["default"])()); // Session middleware

app.use((0, _expressSession["default"])({
  secret: _env["default"].APP_SECRET,
  store: new MongoStore({
    mongooseConnection: _mongoClient["default"]
  }),
  resave: false,
  cookie: {
    maxAge: 60000
  },
  saveUninitialized: false
}));
app.use(_express["default"]["static"](_path["default"].join(__dirname, '../public')));
app.use('/', _index["default"]);
app.use('/auth', _auth["default"]);
app.listen(PORT, function () {
  return console.log("Listening on ".concat(PORT));
});