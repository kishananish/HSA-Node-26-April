'use strict';

import Category from '../models/Category';
import SubCategory from '../models/SubCategory';
import CategoryHistory from '../models/CategoryHistory';
import formatResponse from '../../utils/formatResponse';
import config from '../../config/operationConfig';
import SubCategoryHistory from '../models/SubCategoryHistory';

export const index = async (req, res) => {
    const categories = await Category.find({});
    formatResponse(res, categories);
};

export const getRelatedSubCategories = async (req, res) => {
    const subCategories = await SubCategory.find({ category_id: req.params.id });
    formatResponse(res, subCategories);
};

export const getCategoryHistory = async (req, res) => {
    const searchData = (req.params.id) ? { category_id: req.params.id } : {};
    const history = await CategoryHistory.find(searchData).populate('operator', ['first_name', 'last_name', 'email']);
    formatResponse(res, history);
};

export const add = async (req, res) => {
    const operator = req.user;

    const newCategory = new Category({
        name: req.body.name,
        ar_name: req.body.ar_name,
        imageName: req.body.imageName
    });
    const category = await newCategory.save();

    const history = new CategoryHistory({
        category_id: category._id,
        operation: config.operations.add,
        operator: operator,
        prevObj: null,
        updatedObj: category,
        operation_date: new Date()
    });

    await history.save();
    formatResponse(res, category);

};

export const update = async (req, res) => {

    const operator = req.user;
    const id = req.params.id;
    const category = await Category.findById(id);

    if (!category) {
        let error = new Error('Category not found!');
        error.name = 'NotFound';
        error.ar_message = 'الفئة غير موجودة!';
        return formatResponse(res, error);
    } else {
        const origObj = category.toObject();

        category.name = req.body.name || category.name;
        category.ar_name = req.body.ar_name || category.ar_name;

        category.imageName = req.body.imageName || category.imageName;
        await category.save();

        const history = new CategoryHistory({
            category_id: category._id,
            operation: config.operations.update,
            operator: operator,
            prevObj: origObj,
            updatedObj: category,
            operation_date: new Date()
        });

        await history.save();
        return formatResponse(res, category);

    }
};

export const remove = async (req, res) => {

    const operator = req.user;

    const removedCategory = await Category.findByIdAndRemove(req.params.id);

    if (removedCategory) {
        const history = new CategoryHistory({
            category_id: removedCategory._id,
            operation: config.operations.remove,
            operator: operator,
            prevObj: removedCategory,
            updatedObj: null,
            operation_date: new Date()
        });

        await history.save();
    }

    return formatResponse(res, removedCategory ? removedCategory : {});
};

export const removeAll = async (req, res) => {
    const operator = req.user;
    const categoryIds = req.body.ids;
    const categories = await Category.find({ _id: { $in: categoryIds } });
    const subCategories = await SubCategory.find({ category_id: { $in: categoryIds } });
    
    if (categories.length) {

        const catHistory = categories.map(category => ({
            category_id: category._id,
            operation: config.operations.remove,
            operator: operator,
            prevObj: category,
            updatedObj: null,
            operation_date: new Date()
        }));

        const subCatHistory = subCategories.map(subCategory => ({
            sub_category_id: subCategory._id,
            category_id: subCategory.category_id,
            operation: config.operations.remove,
            operator: operator,
            prevObj: subCategory,
            updatedObj: null,
            operation_date: new Date()
        }));

        await CategoryHistory.insertMany(catHistory);
        await SubCategoryHistory.insertMany(subCatHistory);
    }

    await Category.deleteMany({ _id: { $in: categoryIds } });
    await SubCategory.deleteMany({ category_id: { $in: categoryIds } });
    return formatResponse(res, categories);
};

export const searchCategories = async (req, res) => {
    const items = (req.query.items) ? req.query.items : 10;
    const page = (req.query.page) ? req.query.page : 1;
    const skip = items * (page - 1);
    const limit = parseInt(items);

    const category = req.query.name;
    const searchData = (category) ? { 'name': { $regex: category, $options: 'i' } } : {};
    const result = await Category.find(searchData).skip(skip).limit(limit).lean();

    const count = await Category.find(searchData).countDocuments();

    const data = {
        total: count,
        pages: (count % items === 0) ? count / items : parseInt(count / items) + 1,
        result: result
    };
    if (result.length == 0) {
        data.message = 'No matching categories found, please enter the name correctly';
    }
    formatResponse(res, data);
};