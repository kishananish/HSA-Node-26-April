'use strict';

import formatResponse from '../../utils/formatResponse';
import Material from '../models/Material';
import MaterialHistory from '../models/MaterialHistory';
import config from '../../config/operationConfig';
import User from '../models/User';

export const getMaterials = async (req, res) => {

    const items = (req.query.items) ? req.query.items : 10;
    const page = (req.query.page) ? req.query.page : 1;
    const skip = items * (page - 1);
    const limit = parseInt(items);
    const count = await Material.find({ isDeleted: false }).countDocuments();
    const materials = await Material.find({ isDeleted: false }).populate('material_category_id', ['name']).populate('material_sub_category_id', ['name']).populate('service_provider_id', ['first_name', 'last_name', 'email', 'mobile_no']).sort({ 'created_at': 'desc' }).skip(skip).limit(limit);
    const data = {
        total: count,
        pages: (count % items === 0) ? count / items : parseInt(count / items) + 1,
        result: materials
    };
    formatResponse(res, data);

};

export const getMaterialHistory = async (req, res) => {

    const items = (req.query.items) ? req.query.items : 10;
    const page = (req.query.page) ? req.query.page : 1;
    const skip = items * (page - 1);
    const limit = parseInt(items);

    const count = await MaterialHistory.find().countDocuments();
    const history = await MaterialHistory.find().skip(skip).limit(limit).sort({ 'created_at': 'desc' }).populate('operator', ['first_name', 'last_name', 'email']).populate('prevObj.material_id').lean();

    const data = {
        total: count,
        pages: (count % items === 0) ? count / items : parseInt(count / items) + 1,
        result: history
    };
    formatResponse(res, data);

};

export const getMaterialHistoryById = async (req, res) => {
    const id = req.params.id;
    const history = await MaterialHistory.find({ material_id: id }).populate('operator', ['first_name', 'last_name', 'email']).populate('prevObj.material_id').lean();
    formatResponse(res, history);
};

export const getMaterialsForProvider = async (req, res) => {
    const userId = req.user;
    // const materials = await Material.find({ isDeleted: false, service_provider_id: userId }).populate('material_category_id', ['name']).populate('material_sub_category_id', ['name']).populate('service_provider_id', ['first_name', 'last_name', 'email', 'mobile_no']).sort({ 'created_at': 'desc' }).lean();
    const materials = await Material.find({ isDeleted: false }).populate('material_category_id', ['name']).populate('material_sub_category_id', ['name']).populate('service_provider_id', ['first_name', 'last_name', 'email', 'mobile_no']).sort({ 'created_at': 'desc' }).lean();
    
    formatResponse(res, materials);
};

export const getMaterialByIdForProvider = async (req, res) => {
    const id = req.params.id;
    const userId = req.user;
    const material = await Material.findOne({ _id: id, isDeleted: false, service_provider_id: userId }).populate('service_provider_id', ['first_name', 'last_name', 'email', 'mobile_no']);
    formatResponse(res, material ? material : {});
};

export const getMaterialById = async (req, res) => {
    const id = req.params.id;
    const material = await Material.findOne({ _id: id, isDeleted: false }).populate('service_provider_id', ['first_name', 'last_name', 'email', 'mobile_no']);
    formatResponse(res, material ? material : {});
};
/**
 * @apiDescription add material by admin and provider 
 * @param {*} req 
 * @param {*} res 
 */
export const add = async (req, res) => {
    const userId = req.user;
    req.body.service_provider_id = userId;
    // check it has permission to add material

    const materialNameChecker = await Material.findOne({ material_category_id:req.body.material_category_id,material_sub_category_id:req.body.material_sub_category_id,name:{$in:[req.body.name]}});
    if (materialNameChecker) {
        let error = new Error('Material Name already in use!');
        error.ar_message = 'اسم المادة قيد الاستخدام بالفعل!';
        error.name = 'dataExist';
        return formatResponse(res, error);
    }
    
    const loggedInProvider = await User.findById({ _id: userId, isDeleted: false });
    if (loggedInProvider.add_material_flag == true) {
        const material = await Material.create(req.body);
        await MaterialHistory.create({
            material_id: material._id,
            material_category_id:material.material_category_id,
            material_sub_category_id:material.material_sub_category_id,
            operation: config.operations.add,
            operator: userId,
            prevObj: null,
            updatedObj: material,
            operation_date: new Date()
        });
        formatResponse(res, material);
    } else {
        let error = new Error('User has no permission to add material!');
        error.name = 'ValidationError';
        error.ar_message = 'المستخدم ليس لديه إذن لإضافة المواد!';
        return formatResponse(res, error);
    }

};

export const update = async (req, res) => {
    const id = req.params.id;
    const userId = req.user;
    const material = await Material.findById(id)
    .populate('material_category_id',['name'])
    .populate('material_sub_category_id',['name']);
   
    const loggedInProvider = await User.findById({ _id: userId, isDeleted: false});
    if(loggedInProvider.add_material_flag==false){
        let error = new Error('User has no permission to update material!');
        error.name = 'ValidationError';
        error.ar_message = 'المستخدم ليس لديه إذن لإضافة المواد!';
        return formatResponse(res, error);
    }

    // const materialNameChecker = await Material.findOne({ 
    //     material_category_id:material.material_category_id,
    //     material_sub_category_id:material.material_sub_category_id,
    //     name:{$in:[req.body.name]}
    // });
    // console.log("materialNameChecker ---", materialNameChecker);
   
    // if (materialNameChecker) {
    //     let error = new Error('Material Name already in use!');
    //     error.ar_message = 'اسم المادة قيد الاستخدام بالفعل!';
    //     error.name = 'dataExist';
    //     return formatResponse(res, error);
    // }

    if (!material) {
        let error = new Error('Material not found!');
        error.name = 'NotFound';
        error.ar_message = 'المواد غير موجودة!';
        return formatResponse(res, error);
    } else {
        const prevObj = material.toObject();
        material.set(req.body);
        await material.save();
        await MaterialHistory.create({
            material_id: material._id,
            material_category_id:material.material_category_id,
            material_sub_category_id:material.material_sub_category_id,
            operation: config.operations.update,
            operator: userId,
            prevObj: prevObj,
            updatedObj: material,
            operation_date: new Date()
        });
        return formatResponse(res, material);
    }
};

export const remove = async (req, res) => {

    const id = req.params.id;
    const material = await Material.findOne({ _id: id, isDeleted: false });
    if (!material) {
        let error = new Error('Material not found!');
        error.ar_message = 'المواد غير موجودة!';
        error.name = 'NotFound';
        return formatResponse(res, error);
    }
    material.isDeleted = true;
    await material.save();
    return formatResponse(res, material);

};

export const removeAll = async (req, res) => {
    const materialIds = req.body.ids;
    const materials = await Material.find({ _id: { $in: materialIds }, isDeleted: false });
    await Material.update({ _id: { $in: materialIds }, isDeleted: false }, { isDeleted: true }, { multi: true });
    return formatResponse(res, materials);
};