'use strict';
import Category from '../models/Category';
import FAQ from '../models/FAQ';
import formatResponse from '../../utils/formatResponse';
import FAQHistory from '../models/FAQHistory';
import config from '../../config/operationConfig';

export const index = async (req, res) => {
    const items = (req.query.items) ? req.query.items : 10;
    const page = (req.query.page) ? req.query.page : 1;
    const filter = (req.query.filter) ? { category: req.query.filter } : {};
    const skip = items * (page - 1);
    const limit = parseInt(items);
    console.log(items, '* (', page, '-', 1, ')');
    const count = await FAQ.find(filter).countDocuments();
    const faqs = await FAQ.find(filter).skip(skip).limit(limit);
    const data = {
        total: count,
        pages: (count % items === 0) ? count / items : parseInt(count / items) + 1,
        result: faqs
    };
    formatResponse(res, data);
};

export const getFAQByCategory = async(req,res) => {
        const category = req.params.category;
        const items = (req.query.items) ? req.query.items : 10;
        const page = (req.query.page) ? req.query.page : 1;
        const filter = { category: category };
        const skip = items * (page - 1);
        const limit = parseInt(items);
        const count = await FAQ.find(filter).countDocuments();
        const faqs = await FAQ.find(filter).skip(skip).limit(limit);
        const data = {
            total: count,
            pages: (count % items === 0) ? count / items : parseInt(count / items) + 1,
            result: faqs
        };
        formatResponse(res, data);
};

export const getFAQStatsByCategory = async(req,res) => {
    const result = await Category.aggregate([
        { $lookup:{ from: 'faqs', localField: '_id',foreignField: 'category',as: 'faqs'}},
        { $project:{ _id:'$_id', name:'$name', numOfFaqs:{$size:'$faqs'} }},
        { $match: {'numOfFaqs': {$gt: 0}}}
    ]); 
    formatResponse(res,result);
};

export const getFAQHistoryById = async (req, res) => {
    const id = req.params.id;
    const history = await FAQHistory.find({ faq_id: id }).populate('operator', ['first_name', 'last_name', 'email']);
    formatResponse(res, history);
};
export const getFAQHistory = async (req, res) => {

    const items = (req.query.items) ? req.query.items : 10;
    const page = (req.query.page) ? req.query.page : 1;
    const skip = items * (page - 1);
    const limit = parseInt(items);

    const count = await FAQHistory.find().countDocuments();
    const history = await FAQHistory.find({}).skip(skip).limit(limit).populate('operator', ['first_name', 'last_name', 'email']);

    const data = {
        total: count,
        pages: (count % items === 0) ? count / items : parseInt(count / items) + 1,
        result: history
    };
    formatResponse(res, data);
};

export const add = async (req, res) => {
    const operator = req.user;
    const faq = new FAQ({
        title: req.body.title,
        description: req.body.description,
        ar_description: req.body.ar_description,
        ar_title: req.body.ar_title,
        category: req.body.category,
        created_at: new Date(),
        updated_at: new Date()
    });

    const faqCreated = await faq.save();

    const history = new FAQHistory({
        faq_id: faqCreated._id,
        operation: config.operations.add,
        operator: operator,
        prevObj: null,
        updatedObj: faqCreated,
        operation_date: new Date()
    });

    await history.save();

    formatResponse(res, faqCreated);

};

export const update = async (req, res) => {
    const operator = req.user;
    const id = req.params.id;
    const faq = await FAQ.findById(id);

    if (!faq) {
        let error = new Error('FAQ not found!');
        error.ar_message = 'التعليمات غير موجودة!';
        error.name = 'NotFound';
        return formatResponse(res, error);
    } else {
        const origObj = new FAQ({
            title: faq.title,
            description: faq.description,
            created_at: faq.created_at,
            updated_at: new Date()
        });

        faq.title = req.body.title || faq.title;
        faq.description = req.body.description || faq.description;
        faq.category = req.body.category || faq.category;
        faq.updated_at = new Date();

        await faq.save();

        const history = new FAQHistory({
            faq_id: faq._id,
            operation: config.operations.update,
            operator: operator,
            prevObj: origObj,
            updatedObj: faq,
            operation_date: new Date()
        });

        await history.save();

        return formatResponse(res, faq);
    }
};

export const remove = async (req, res) => {
    const operator = req.user;
    const removedFAQ = await FAQ.findByIdAndRemove(req.params.id);
    if (removedFAQ) {
        const history = new FAQHistory({
            faq_id: removedFAQ._id,
            operation: config.operations.remove,
            operator: operator,
            prevObj: removedFAQ,
            updatedObj: null,
            operation_date: new Date()
        });

        await history.save();
    }
    return formatResponse(res, removedFAQ ? removedFAQ : {});
};

export const removeAll = async (req, res) => {
    const operator = req.user;
    const faqIds = req.body.ids;
    const FAQs = await FAQ.find({ _id: { $in: faqIds } });

    if (FAQs.length) {
        const history = FAQs.map(faq => ({
            faq_id: faq._id,
            operation: config.operations.remove,
            operator: operator,
            prevObj: faq,
            updatedObj: null,
            operation_date: new Date()
        }));

        await FAQHistory.insertMany(history);
    }

    await FAQ.deleteMany({ _id: { $in: faqIds } });
    return formatResponse(res, FAQs);
};
