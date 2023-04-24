const admin = require('firebase-admin');
import * as constants from '../../src/handler/constants';

const CONSUMER_CERT = require('../../config/homeservices-firebase.json');
const PROVIDER_CERT = require('../../config/homeservices-firebase_provider.json');

import shortid from 'shortid';
shortid.characters(
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);

const consumer = admin.initializeApp({
    credential: admin.credential.cert(CONSUMER_CERT)
});

const provider = admin.initializeApp(
    {
        credential: admin.credential.cert(PROVIDER_CERT)
    },
    'provider'
);

export const sendPushNotification = async (tokens, payloads, roleToSend) => {
    // console.log('devices -->',tokens);
    if (!payloads) {
        throw new Error('You must provide a payload object');
    }
    else if (tokens && (tokens.filter(str => str && str.trim().length > 0).length > 0)) {
        if (tokens instanceof Array && typeof tokens[0] === 'string') {
            const options = {
                priority: 'high',
                timeToLive: 60 * 60 * 24
            };
            console.log('roleToSend :', roleToSend);
            if (roleToSend === constants.CUSTOMER) {
                // console.log("tokens ---->",tokens);
                return consumer.messaging().sendToDevice(tokens, payloads, options)
                    .then(res => console.log('response---->', tokens, '<><>', res.results[0].error))
                    .catch(err => console.log('err-----', err));
            } else if (roleToSend === constants.SERVICE_PROVIDER) {
                return provider.messaging().sendToDevice(tokens, payloads, options)
                    .then(res => console.log('response---->', tokens, '<><>', res.results[0].error))
                    .catch(err => console.log('err-----', err));
            } else {
                return admin.messaging().sendToDevice(tokens, payloads, options)
                    .then(res => console.log('other response---->', tokens, res.results[0].error))
                    .catch(err => console.log('err-----', err));
            }
        } else {
            const error = new Error('Invalid device token, tokens must be array of string!');
            throw error;
        }
    } else {
        const error = new Error(
            'Invalid device token, tokens must be array of string!'
        );
        throw error;
    }
};

export const sendPushNotificationToMultiple = async (devices, payloads, roleToSend) => {
    console.log('devices -->', devices);
    if (!payloads) {
        throw new Error('You must provide a payload object');
    }
    else if (devices instanceof Array && typeof devices[0] === 'string') {
        const options = {
            priority: 'high',
            timeToLive: 60 * 60 * 24,
        };
        if (roleToSend === constants.CUSTOMER) {
            // console.log('in customer');
            devices.map(function (deviceId) {
                consumer.messaging().sendToDevice(deviceId, payloads, options)
                    .then(res => console.log('customer response---->', res, res.results[0].error))
                    .catch(err => console.log('err-----', err));
            });
        } else if (roleToSend === constants.SERVICE_PROVIDER) {
            console.log('service provider :');
            devices.map(function (deviceId) {
                provider.messaging().sendToDevice(deviceId, payloads, options)
                    .then(res => console.log('service response---->', res, res.results[0].error))
                    .catch(err => console.log('err-----', err));
            });
        } else {
            devices.map(function (deviceId) {
                consumer.messaging().sendToDevice(deviceId, payloads, options)
                    .then(res => console.log('service response---->', res.results[0].error))
                    .catch(err => console.log('err-----', err));
            });

        }
    }
    else {
        const error = new Error(
            'Invalid device token, tokens must be array of string!'
        );
        throw error;
    }
};
