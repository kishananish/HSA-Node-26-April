'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var awsConfig = _config2.default.AWS;
_awsSdk2.default.config.update(awsConfig);

var sendSms = function sendSms(mobileNo, smsParams) {
	_logger2.default.info('sms sent to mobile no : ', smsParams);
	return true;

	// const sns = new AWS.SNS();
	// var smsParams = {
	// 	//"Message": new Date()+" OTP for SpotCrunch registration is "+token+".",
	// 	"Message": "Your PIN is " + token + " sent at " + new Date() + " time by SpotCrunch",
	// 	"PhoneNumber": mobile_no
	// };

	// sns.publish(smsParams, function (err, data) {
	// 	if (err) {
	// 		console.log(err);
	// 		cb(null, false, 'Sorry, error occurred.');
	// 	} else {
	// 		console.log('success', data, token);
	// 		cb(null, true, 'OTP has been sent to your mobile.');
	// 	}

	// });
};

exports.default = sendSms;