'use strict';

import ContactUs from '../models/ContactUs';
import ContactUsHistory from '../models/ContactUsHistory';
import formatResponse from '../../utils/formatResponse';
import config from '../../config/operationConfig';
import utils from '../../config/config';

export const index = async (req, res) => {

    const userId = req.user;
    const result = await ContactUs.find({ query_by: userId }).sort({ 'created_at': 'desc' }).lean();

    formatResponse(res, result);
};

export const queryForAdmin = async (req, res) => {

    const items = (req.query.items) ? req.query.items : 10;
    const page = (req.query.page) ? req.query.page : 1;
    const skip = items * (page - 1);
    const limit = parseInt(items);

    const contactUsPromise = ContactUs.find({}).populate('query_by', ['first_name', 'last_name']).sort({ 'created_at': 'desc' }).skip(skip).limit(limit).lean();
    const countPromise = ContactUs.find({}).countDocuments();

    const [contactUs, count] = await Promise.all([contactUsPromise, countPromise]);

    const data = {
        total: count,
        pages: (count % items === 0) ? count / items : parseInt(count / items) + 1,
        result: contactUs
    };

    formatResponse(res, data);
};

export const getContactUsHistory = async (req, res) => {

    const items = (req.query.items) ? req.query.items : 10;
    const page = (req.query.page) ? req.query.page : 1;
    const skip = items * (page - 1);
    const limit = parseInt(items);

    const countPromise = ContactUsHistory.find().countDocuments();
    const historyPromise = ContactUsHistory.find().skip(skip).limit(limit).populate('operator', ['first_name', 'last_name', 'email']);

    const [history, count] = await Promise.all([historyPromise, countPromise]);

    const data = {
        total: count,
        pages: (count % items === 0) ? count / items : parseInt(count / items) + 1,
        result: history
    };

    formatResponse(res, data);
};
export const getContactUsHistoryById = async (req, res) => {

    const contact_us_id = req.params.id;
    const history = await ContactUsHistory.find({ contact_us_id: contact_us_id }).populate('operator', ['first_name', 'last_name', 'email']);

    formatResponse(res, history);
};

export const add = async (req, res) => {

    const operator = req.user;
    const newContactUs = new ContactUs({
        title: req.body.title,
        description: req.body.description,
        query_by: operator
    });

    const contactUs = await newContactUs.save();

    const history = new ContactUsHistory({
        contact_us_id: contactUs._id,
        operation: config.operations.add,
        operator: operator,
        prevObj: null,
        updatedObj: contactUs,
        operation_date: new Date()
    });

    await history.save();
    formatResponse(res, contactUs);
};

export const update = async (req, res) => {

    const operator = req.user;
    const id = req.params.id;
    const contactUs = await ContactUs.findById(id);

    if (!contactUs) {
        let error = new Error('ContactUs not found!');
        error.ar_message = 'ContactUs غير موجود!';
        error.name = 'NotFound';
        return formatResponse(res, error);
    } else {
        const origObj = new ContactUs({
            _id: contactUs._id,
            title: contactUs.title,
            description: contactUs.description,
            response: contactUs.response
        });

        contactUs.title = req.body.title || contactUs.title;
        contactUs.description = req.body.description || contactUs.description;
        contactUs.response = req.body.response || contactUs.response;

        await contactUs.save();

        const history = new ContactUsHistory({
            contact_us_id: contactUs._id,
            operation: config.operations.update,
            operator: operator,
            prevObj: origObj,
            updatedObj: contactUs,
            operation_date: new Date()
        });

        await history.save();
        return formatResponse(res, contactUs);

    }
};

export const remove = async (req, res) => {

    const operator = req.user;
    const removedObj = await ContactUs.findByIdAndRemove(req.params.id);

    if (removedObj) {
        const history = new ContactUsHistory({
            contact_us_id: removedObj._id,
            operation: config.operations.remove,
            operator: operator,
            prevObj: removedObj,
            updatedObj: null,
            operation_date: new Date()
        });

        await history.save();
    }

    return formatResponse(res, removedObj);
};

export const removeAll = async (req, res) => {


    const operator = req.user;
    const contactUsIds = req.body.ids;
    const results = await ContactUs.find({ _id: { $in: contactUsIds } });

    if (results.length) {
        const history = results.map(result => ({
            contact_us_id: result._id,
            operation: config.operations.remove,
            operator: operator,
            prevObj: result,
            updatedObj: null,
            operation_date: new Date()
        }));

        await ContactUsHistory.insertMany(history);
    }

    await ContactUs.deleteMany({ _id: { $in: contactUsIds } });
    formatResponse(res, results);
};

export const infoPage = async (req, res) => {
    res.render('business-template', {
        android_link: config.ANDROID_LINK,
        ios_link: config.IOS_LINK,
        title: 'Home Service Application'
    });
};