'use strict';

import SubCategory from '../models/SubCategory';
import SubCategoryHistory from '../models/SubCategoryHistory';
import formatResponse from '../../utils/formatResponse';
import config from '../../config/operationConfig';

export const index = async (req, res) => {
    const subCategories = await SubCategory.find({}).populate('category_id');
    formatResponse(res, subCategories);
};

export const getSubCategoryHistory = async (req, res) => {
    const searchData = (req.params.id) ? { sub_category_id: req.params.id } : {};
    const history = await SubCategoryHistory.find(searchData).populate('operator', ['first_name', 'last_name', 'email']).populate('prevObj.category_id').populate('sub_category_id');
    formatResponse(res, history);
};

export const add = async (req, res) => {

    const operator = req.user;
    const newSubCategory = new SubCategory({
        name: req.body.name,
        ar_name: req.body.ar_name,
        category_id: req.body.category_id,
    });

    const subCategory = await newSubCategory.save();

    const history = new SubCategoryHistory({
        sub_category_id: subCategory._id,
        category_id: subCategory.category_id,
        operation: config.operations.add,
        operator: operator,
        prevObj: null,
        updatedObj: subCategory,
        operation_date: new Date()
    });

    await history.save();
    formatResponse(res, subCategory);

};

export const update = async (req, res) => {

    const operator = req.user;
    const subCategory = await SubCategory.findById(req.params.id);

    if (subCategory) {
        const origObj = subCategory.toObject();

        subCategory.name = req.body.name;
        subCategory.category_id = req.body.category_id ? req.body.category_id : subCategory.category_id;
        subCategory.ar_name=req.body.ar_name;
        await subCategory.save();

        const history = new SubCategoryHistory({
            sub_category_id: subCategory._id,
            category_id: subCategory.category_id,
            operation: config.operations.update,
            operator: operator,
            prevObj: origObj,
            updatedObj: subCategory,
            operation_date: new Date()
        });

        await history.save();
        return formatResponse(res, subCategory);

    } else {
        let error = new Error('SubCategory not found!');
        error.ar_message = 'الفئة الفرعية غير موجودة!';
        error.name = 'NotFound';
        return formatResponse(res, error);
    }
};

export const remove = async (req, res) => {

    const operator = req.user;
    const removedSubCategory = await SubCategory.findByIdAndRemove(req.params.id);

    if (removedSubCategory) {
        const history = new SubCategoryHistory({
            sub_category_id: removedSubCategory._id,
            category_id: removedSubCategory.category_id,
            operation: config.operations.remove,
            operator: operator,
            prevObj: removedSubCategory,
            updatedObj: null,
            operation_date: new Date()
        });

        await history.save();
    }

    return formatResponse(res, removedSubCategory ? removedSubCategory : {});
};

export const removeAll = async (req, res) => {

    const operator = req.user;
    const subCategoryIds = req.body.ids;
    const subCategories = await SubCategory.find({ _id: { $in: subCategoryIds } });

    if (subCategories.length) {

        const history = subCategories.map(subCategory => ({
            sub_category_id: subCategory._id,
            category_id: subCategory.category_id,
            operation: config.operations.remove,
            operator: operator,
            prevObj: subCategory,
            updatedObj: null,
            operation_date: new Date()
        }));

        await SubCategoryHistory.insertMany(history);
    }

    await SubCategory.deleteMany({ _id: { $in: subCategoryIds } });
    return formatResponse(res, subCategories);
};