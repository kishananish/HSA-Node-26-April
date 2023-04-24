require('dotenv').config();
//

const twilio = require('twilio');

// const client = twilio(accountSid, authToken);

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

const sendSms = (phone, message) => {
  // console.log(client);
  // console.log(phone);
  // console.log(message);
  client.messages
    .create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    })
    .then((message) => console.log(message.sid))
    .catch((e) => {
      console.log(e);
    });
};

module.exports = sendSms;
