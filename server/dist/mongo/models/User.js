"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = require("mongoose");

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var SALT_WORK_FACTOR = 10;
var UserSchema = new _mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String
  },
  id: {
    type: String
  }
});
UserSchema.pre('save', function (next) {
  var user = this; // only hash the password if it has been modified (or is new)

  if (!user.isModified('password')) return next(); // generate a salt

  _bcrypt["default"].genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err); // hash the password using our new salt

    _bcrypt["default"].hash(user.password, salt, function (err, hash) {
      if (err) return next(err); // override the cleartext password with the hashed one

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  _bcrypt["default"].compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

var _default = (0, _mongoose.model)('User', UserSchema);

exports["default"] = _default;