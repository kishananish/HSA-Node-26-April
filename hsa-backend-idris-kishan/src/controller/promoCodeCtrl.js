'use strict';

import PromoCode from '../models/PromoCode';
import PromoCodeHistory from '../models/PromoCodeHistory';
import formatResponse from '../../utils/formatResponse';
import config from '../../config/operationConfig';

export const index = async (req, res) => {
    const items = (req.query.items) ? req.query.items : 10;
    const page = (req.query.page) ? req.query.page : 1;
    const skip = items * (page - 1);
    const limit = parseInt(items);

    let searchQuery = {};
    if (req.query.category_id && req.query.category_id != null) {
        searchQuery = {
            is_removed: false,
            category_id: req.query.category_id,
            start_date: { $lte: new Date() },
            end_date: { $gte: new Date() }
        };
    } else {
        searchQuery = {
            is_removed: false,
            start_date: { $lte: new Date() },
            end_date: { $gte: new Date() }
        };
    }

    const count = await PromoCode.find(searchQuery).countDocuments();
    const codes = await PromoCode.find(searchQuery).skip(skip).limit(limit).sort({ created_at: -1 }).populate('category_id').lean();

    const data = {
        total: count,
        pages: (count % items === 0) ? count / items : parseInt(count / items) + 1,
        result: codes
    };

    formatResponse(res, data);
};

export const getPromoCodeHistory = async (req, res) => {
    const items = (req.query.items) ? req.query.items : 10;
    const page = (req.query.page) ? req.query.page : 1;
    const skip = items * (page - 1);
    const limit = parseInt(items);

    const count = await PromoCodeHistory.find().countDocuments();
    const history = await PromoCodeHistory.find().skip(skip).limit(limit).populate('operator', ['first_name', 'last_name', 'email']).populate('prevObj.category_id').lean();

    const data = {
        total: count,
        pages: (count % items === 0) ? count / items : parseInt(count / items) + 1,
        result: history
    };
    formatResponse(res, data);
};

export const getPromoCodeHistoryById = async (req, res) => {
    const id = req.params.id;
    const history = await PromoCodeHistory.find({ promocode_id: id }).populate('operator', ['first_name', 'last_name', 'email']).populate('prevObj.category_id').lean();
    formatResponse(res, history);
};

export const add = async (req, res) => {
    if (!req.body.code) {
        let error = new Error('Please provide a promo-code');
        error.name = 'ValidationError';
        error.ar_message = 'يرجى تقديم الرمز الترويجي';
        return formatResponse(res, error);
    }
    const existingPromo = await PromoCode.findOne({ code: req.body.code, is_removed: false }).lean();
    if (existingPromo) {
        let error = new Error('Please provide a unique promo-code');
        error.name = 'dataExist';
        error.ar_message = 'يرجى تقديم الرمز الترويجي الفريد';
        return formatResponse(res, error);
    }
    const operator = req.user;
    const code = new PromoCode({
        code: req.body.code,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        category_id: req.body.category_id,
        percentage: req.body.percentage,
        amount: req.body.amount,
        created_at: new Date()
    });

    const codeCreated = await code.save();

    const history = new PromoCodeHistory({
        promocode_id: codeCreated._id,
        operation: config.operations.add,
        operator: operator,
        prevObj: null,
        updatedObj: codeCreated,
        operation_date: new Date()
    });

    await history.save();
    if (codeCreated && history) {
        codeCreated.message = 'Promo-code Added Successfully !';
        codeCreated.ar_message = 'تمت إضافة الرمز الترويجي بنجاح';
    }
    formatResponse(res, codeCreated);
};

export const update = async (req, res) => {
    const operator = req.user;
    const id = req.params.id;
    const code = await PromoCode.findById(id);

    if (!code) {
        let error = new Error('Promo code not found!');
        error.ar_message = 'الرمز الترويجي غير موجود';
        error.name = 'NotFound';
        return formatResponse(res, error);
    } else {
        code.code = req.body.code;
        code.start_date = req.body.start_date;
        code.end_date = req.body.end_date;
        code.category_id = req.body.category_id;
        code.percentage = req.body.percentage;
        code.amount = req.body.amount;
        code.updated_at = new Date();

        await code.save();

        const history = new PromoCodeHistory({
            promocode_id: code._id,
            operation: config.operations.update,
            operator: operator,
            prevObj: code,
            updatedObj: code,
            operation_date: new Date()
        });

        await history.save();
        return formatResponse(res, code);

    }
};

export const remove = async (req, res) => {
    const operator = req.user;
    const id = req.params.id;
    const code = await PromoCode.findById(id);

    if (!code) {
        let error = new Error('Promo code not found!');
        error.ar_message = 'الرمز الترويجي غير موجود';
        error.name = 'NotFound';
        return formatResponse(res, error);
    } else {
        code.is_removed = true;
        code.updated_at = new Date();
        await code.save();

        const history = new PromoCodeHistory({
            promocode_id: code._id,
            operation: config.operations.remove,
            operator: operator,
            prevObj: null,
            updatedObj: code,
            operation_date: new Date()
        });

        await history.save();

        return formatResponse(res, code);
    }
};

export const removeAll = async (req, res) => {
    const operator = req.user;
    const promoCodeIds = req.body.ids;
    const codes = await PromoCode.find({ _id: { $in: promoCodeIds } });

    if (codes.length) {
        const promoCodeHistory = codes.map(code => ({
            promocode_id: code._id,
            operation: config.operations.remove,
            operator: operator,
            prevObj: code,
            updatedObj: null,
            operation_date: new Date()
        }));

        await PromoCodeHistory.insertMany(promoCodeHistory);
    }

    await PromoCode.update({ _id: { $in: promoCodeIds } }, { is_removed: true, updated_at: new Date() }, { multi: true });

    return formatResponse(res, codes);
};

export const apply = async (req, res) => {
    const userId = req.user;
    const categoryId = req.params.category_id;
    const promocode = req.body.code;
    const code = await PromoCode.findOne({
        code: promocode,
        category_id: categoryId,
        is_removed: false,
        start_date: { $lte: new Date() },
        end_date: { $gte: new Date() }
    });

    if (!code) {
        return formatResponse(res, { valid: false, message: 'Please enter valid promo code', ar_message: 'الرجاء إدخال الرمز الترويجي الصحيح' });
    } else {
        let promo_history = new PromoCodeHistory({
            promocode_id: code._id,
            operation: config.operations.promo_used,
            operator: userId,
            prevObj: null,
            updatedObj: code,
            operation_date: new Date()
        });
        await promo_history.save();
        return formatResponse(res, { valid: true, promocode: code, message: 'Promo-code Applied Successfully', ar_message: 'تطبيق الرمز الترويجي بنجاح' });
    }
};
