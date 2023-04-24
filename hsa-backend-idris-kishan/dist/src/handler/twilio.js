'use strict';

require('dotenv').config();
//

var twilio = require('twilio');

// const client = twilio(accountSid, authToken);

var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;

var client = require('twilio')(accountSid, authToken);

var sendSms = function sendSms(phone, message) {
  // console.log(client);
  // console.log(phone);
  // console.log(message);
  client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone
  }).then(function (message) {
    return console.log(message.sid);
  }).catch(function (e) {
    console.log(e);
  });
};

module.exports = sendSms;