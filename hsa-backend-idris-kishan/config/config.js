/* eslint-disable indent */
/**
 * This module is used to collect all the configuration variables,
 * like the environment vars, in one place so they are not scattered all over the whole codebase
 */

 import dotenv from 'dotenv';

 dotenv.config();
 
 const env = process.env.NODE_ENV || 'production';
 
 const config = {
    
    
     production: {
         PORT: process.env.PORT,
         ENV: process.env.ENV,
         HOST: process.env.HOST,
         ACCESS_CODE: process.env.ACCESS_CODE,
         MERCHANT_IDENTIFIER: process.env.MERCHANT_IDENTIFIER,
         PASSPHARSE: process.env.PASSPHARSE,
         JWT_SECRET: process.env.JWT_SECRET,
         CURRENCY: process.env.CURRENCY,
         IMAGE_SERVER_URL: process.env.IMAGE_SERVER_URL,
         authTypes: {
             ADMIN: 'admin',
             SERVICE_PROVIDER: 'service_provider',
             USER: 'user'
         },
         DATABASE: {
             DB_HOST: 'hsa-olchk.mongodb.net',
             DB_PORT: 23063,
             DB_NAME: 'hsanew',
             DB_USER: 'hameedservice',
             DB_PWD: 'kishan123',
             DB_URL: 'hsa-olchk.mongodb.net/hsanew?retryWrites=true&w=majority',
         },
         AWS: {
             AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
             AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
             REGION: process.env.AWS_REGION,
         },
         EMAIL: {
             HOST: process.env.EMAIL_HOST,
             PORT: process.env.EMAIL_PORT,
             USER: process.env.EMAIL_USER,
             PWD: process.env.EMAIL_PASSWORD
         },
         TWILIO: {
             ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
             AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
             PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER
         },
         OTP: {
             digits: 4,
             step: 120,
             encoding: 'base32'
         },
         WINSTON: {
             levels: {
                 error: 0,
                 warn: 1,
                 info: 2,
                 verbose: 3,
                 debug: 4,
                 silly: 5
             }
         },
         SWAGGER_URL: process.env.SWAGGER_URL,
         oauth: {
             facebook: {
                 clientId: process.env.FACEBOOK_APPID,
                 clientSecret: process.env.FACEBOOK_APPSECRET
             },
             google: {
                 clientId: process.env.GOOGLE_APPID,
                 clientSecret: process.env.GOOGLE_APPSECRET
             }
         },
         notification: {
             fcm: process.env.FCM
         }
     }
 };
 
 export default config[env];
 