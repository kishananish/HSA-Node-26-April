'use strict';

import ServiceRequest from '../models/ServiceRequest';
import formatResponse from '../../utils/formatResponse';
const protoTypeMethods = require('./protoType');

export const index = async (req, res) => {

    const operator = req.user;
    const items = (req.query.items) ? req.query.items : 10;
    const page = (req.query.page) ? page : 1;
    const skip = items * (page - 1);
    const limit = parseInt(items);

    const count = await ServiceRequest.find({}).countDocuments();
    const serviceRequests = await ServiceRequest.find({ requester: operator }).skip(skip).limit(limit);

    const data = {
        total: count,
        pages: (count % items === 0) ? count / items : parseInt(count / items) + 1,
        result: serviceRequests
    };

    formatResponse(res, data);
};

// TODO: filter saved images names and video name
export const add = async (req, res) => {

    const operator = req.user;
    let images = [];
    let video = null;

    if (req.files && req.files != undefined) {
        if (req.files['request-images'] && req.files['request-images'].length) {
            for (let i = 0; i < req.files['request-images'].length; i++) {
                const img = req.files['request-images'][i];
                const imgName = img.filename;
                images.push(imgName);
            }
        }

        if (req.files['request-video'] && req.files['request-video'].length) {
            const videoFile = req.files['request-video'][0];
            video = videoFile.filename;
        }
    }

    const coordinates = typeof (req.body.coordinates) === 'string' ? JSON.parse(req.body.coordinates) : req.body.coordinates;
    const track = protoTypeMethods.getSocketObject();
    track.emit('gettingPosition', coordinates);
    const newServiceRequest = new ServiceRequest({
        address: {
            type: 'Point',
            coordinates: coordinates
        },
        description: req.body.description,
        photos: images,
        video: video,
        promoCode: req.body.promoCode,
        requester: operator,
        created_at: new Date()
    });

    try {
        const serviceRequest = await newServiceRequest.save();

        formatResponse(res, serviceRequest);
    } catch (err) {
        formatResponse(res, err);
    }
};

export const update = async (req, res) => {
    // The user is not allowed to change PromoCode or upload new images or video

    const operator = req.user;
    const id = req.params.id;
    const serviceRequest = await ServiceRequest.find({ _id: id, requester: operator });

    if (!serviceRequest) {

        let error = new Error('ServiceRequest not found!');
        error.ar_message = 'لم يتم العثور على الخدمة!';
        error.name = 'NotFound';
        return formatResponse(res, error);
    } else {

        if (req.body.coordinates) {
            const coordinates = typeof (req.body.coordinates) === 'string' ? JSON.parse(req.body.coordinates) : req.body.coordinates;

            const newAddress = {
                type: 'Point',
                coordinates: coordinates
            };

            serviceRequest.address = newAddress;
        }

        serviceRequest.description = req.body.description || serviceRequest.description;
        serviceRequest.updated_at = new Date();

        try {

            await serviceRequest.save();
            return formatResponse(res, serviceRequest);
        } catch (err) {
            return formatResponse(res, err);
        }
    }
};

export const remove = async (req, res) => {

    const operator = req.user;
    const removedObj = await ServiceRequest.findOneAndRemove({ _id: req.params.id, requester: operator });

    return formatResponse(res, removedObj ? removedObj : {});
};

