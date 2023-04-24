import logger from './logger';
import AWS from 'aws-sdk';

import config from '../config/config';

const awsConfig = config.AWS;
AWS.config.update(awsConfig);

const sendSms = (mobileNo, smsParams) => {
	logger.info('sms sent to mobile no : ', smsParams);
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

export default sendSms;