'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyOtp = exports.generateOtp = undefined;

var _speakeasy = require('speakeasy');

var _speakeasy2 = _interopRequireDefault(_speakeasy);

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var otpConfig = _config2.default.OTP;
var secret = _speakeasy2.default.generateSecret({ length: 20 });

var generateOtp = exports.generateOtp = function generateOtp() {
  console.log('generateOtp secret ==>', secret);
  return _speakeasy2.default.totp({
    secret: 'GZASGJCRHF2G6KBRIU3CKQJDKBAX23ST',
    encoding: 'base32',
    digits: otpConfig.digits,
    step: otpConfig.step
  });
};

var verifyOtp = exports.verifyOtp = function verifyOtp(otp) {
  console.log('verifyOtp secret ==>', secret);

  return _speakeasy2.default.totp.verify({
    secret: 'GZASGJCRHF2G6KBRIU3CKQJDKBAX23ST',
    encoding: 'base32',
    token: otp,
    digits: 4,
    step: 240
  });
};