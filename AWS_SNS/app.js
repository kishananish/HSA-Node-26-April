const express = require("express");
const app = express();
const AWS = require("aws-sdk"); //npm install aws-sdk
require("dotenv").config(); //npm install dotenv
const PORT = 3000;
//function to generate random number
function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
//function to send OTP using AWS-SNS
function sendOTP() {
  var mobileNo = "918130634131";
  var OTP = generateRandomNumber(1000, 9999);

  var params = {
    Message:
      "Welcome! your mobile verification code is: " +
      OTP +
      "     Mobile Number is:" +
      mobileNo /* required */,
    PhoneNumber: mobileNo,
  };
  return new AWS.SNS({ apiVersion: "2010-03-31" })
    .publish(params)
    .promise()
    .then((message) => {
      console.log("OTP SEND SUCCESS");
    })
    .catch((err) => {
      console.log("Error " + err);
      return err;
    });
}
sendOTP(); //calling send otp function
