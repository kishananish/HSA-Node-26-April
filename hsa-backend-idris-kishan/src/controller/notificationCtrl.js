'use strict';

import formatResponse from '../../utils/formatResponse';
import Notifications from '../models/Notification';
import User from '../models/User';
import Customer from '../models/Customer';
// import { firebaseNotificationToProviderApp, firebaseNotificationToUserApp } from '../handler/FCMService';
import { sendPushNotification, sendPushNotificationToMultiple } from '../handler/pushNotification';



export const getNotifications = async (req, res) => {

    const items = (req.query.items) ? req.query.items : 10;
    const page = (req.query.page) ? req.query.page : 1;
    const skip = items * (page - 1);
    const limit = parseInt(items);
    const count = await Notifications.find().countDocuments();
    const notifications = await Notifications.find().sort({ 'created_at': 'desc' }).populate('user_id', ['first_name', 'last_name']).populate('service_provider_id', ['first_name', 'last_name']).skip(skip).limit(limit);

    const data = {
        total: count,
        pages: (count % items === 0) ? count / items : parseInt(count / items) + 1,
        result: notifications
    };
    formatResponse(res, data);

};

export const getNotificationById = async (req, res) => {
    const id = req.params.id;
    const notification = await Notifications.findById(id).populate('user_id', ['first_name', 'last_name']).populate('service_provider_id', ['first_name', 'last_name']);
    formatResponse(res, notification ? notification : {});
};

export const add = async (req, res) => {
    const userIds = req.body.user_id;
    console.log('incoming userIds :',userIds);
    let users;
    /**
	 * (req.body.user_type) => User role who 
	 */
    if (req.body.user_type === 'service_provider') {
        req.body.onModel = 'User';
        users = await User.find({ _id: { $in: userIds } });
        // console.log('user  user: : :',users)
    } else {
        req.body.onModel = 'Customer';
        users = await Customer.find({ _id: { $in: userIds } });
        // console.log('user  cust : : :',users);
    }
            
    const deviceIds = users.map(user => user.device_id).filter(deviceid => {
        return deviceid != undefined;
    });
    console.log('deviceIds~~~~~', deviceIds);

    const new_notification = await Notifications.create(req.body);
    // console.log('new notification :>', req.body);
    if (deviceIds.length) {        
        console.log('in side :',);
        let params = {};
        if (req.body.user_type === 'user') {
            params = {
                data: {
                    message: 'Test message from admin api',
                    newNotification : new_notification.content,                    
                    userType : req.body.user_type 
                },
                notification: {
                    title: new_notification.content,
                    body: 'Custom Body Content'
                }
            };
            
            await sendPushNotificationToMultiple(deviceIds, params,req.body.user_type);
        } else {
            params = {
                data: {
                    message: 'Test message from admin api',
                    newNotification : new_notification.content,                    
                    userType : req.body.user_type                                         
                },
                notification: {
                    title: req.body.content,
                    body: 'Custom Body Content'
                }
            };
            await sendPushNotificationToMultiple(deviceIds, params,req.body.user_type);
        }
    }
    formatResponse(res, new_notification);
};

export const remove = async (req, res) => {

    const id = req.params.id;
    const notification = await Notifications.findOne({ _id: id });
    if (!notification) {
        let error = new Error('Notification not found!');
        error.ar_message = 'الإخطار غير موجود!';
        error.name = 'NotFound';
        return formatResponse(res, error);
    }
    await Notifications.remove({ _id: id });
    return formatResponse(res, notification);

};

export const removeAll = async (req, res) => {
    const notificationIds = req.body.ids;
    const notifications = await Notifications.find({ _id: { $in: notificationIds } });
    await Notifications.remove({ _id: { $in: notificationIds } });
    return formatResponse(res, notifications);
};

/**
 * Send notification to users on devices
 * @param {*} req 
 * @param {*} res 
 */
export const send = async (req, res) => {
    const tokens = req.body.deviceId;
    const payload = {
        notification: {
            title: 'Congrats!',
            body: 'Customer Has Accepted Your Quote',
        }
    };
    await sendPushNotificationToMultiple(tokens, payload)
        .then(res => console.log('res------', res))
        .catch(err => console.log('err------', err));
    formatResponse(res, {});
};