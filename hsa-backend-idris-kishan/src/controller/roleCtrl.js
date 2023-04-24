'use strict';

import formatResponse from '../../utils/formatResponse';
import config from '../../config/operationConfig';
import Role from '../models/Role';
import RoleHistory from '../models/RoleHistory';

export const getRoles = async (req, res) => {

    const items = (req.query.items) ? req.query.items : 10;
    const page = (req.query.page) ? req.query.page : 1;
    const skip = items * (page - 1);
    const limit = parseInt(items);
    const count = await Role.find({ isDeleted: false, name: { $ne: 'admin' } }).countDocuments();
    const role = await Role.find({ isDeleted: false, name: { $ne: 'admin' } }).skip(skip).limit(limit);

    const data = {
        total: count,
        pages: (count % items === 0) ? count / items : parseInt(count / items) + 1,
        result: role
    };
    formatResponse(res, data);

};


export const getRoleById = async (req, res) => {
    const id = req.params.id;
    const role = await Role.findOne({ _id: id, isDeleted: false, name: { $ne: 'admin' } });
    formatResponse(res, role ? role : {});
};
export const add = async (req, res) => {

    const operator = req.user;
    const existingRole = await Role.findOne({ name: req.body.name });
    if (!existingRole) {
        const newRole = new Role({
            name: req.body.name,
            isDeleted: req.body.isDeleted,
            active: req.body.active,
            access_level: req.body.access_level
        });

        const role = await newRole.save();

        const history = new RoleHistory({
            role_id: role._id,
            operation: config.operations.add,
            operator: operator,
            prevObj: null,
            updatedObj: role,
            operation_date: new Date()
        });
        await history.save();
        formatResponse(res, role);
    }
    else {
        if (existingRole.isDeleted) {
            existingRole.isDeleted = false;
            const updatedRole = await existingRole.save();
            return formatResponse(res, updatedRole);
        }
        const err = new Error('Role exists!');
        err.ar_message = 'الدور موجود!';
        err.name = 'dataExist';
        formatResponse(res, err);
    }

};

export const update = async (req, res) => {

    const operator = req.user;
    const id = req.params.id;
    const role = await Role.findById(id);

    if (!role) {
        let error = new Error('Role not found!');
        error.ar_message = 'الدور غير موجود!';
        error.name = 'NotFound';
        return formatResponse(res, error);
    } else {
        const prevObj = role.toObject();
        role.set({
            name: req.body.name,
            active: req.body.active,
            access_level: req.body.access_level
        });
        await role.save();
        const history = new RoleHistory({
            role_id: role._id,
            operation: config.operations.update,
            operator: operator,
            prevObj: prevObj,
            updatedObj: role,
            operation_date: new Date()
        });

        await history.save();
        return formatResponse(res, role);

    }
};



export const remove = async (req, res) => {

    const operator = req.user;
    const id = req.params.id;

    const role = await Role.findOne({ _id: id });

    if (!role) {
        let error = new Error('Role not found!');
        error.ar_message = 'الدور غير موجود!';
        error.name = 'NotFound';
        return formatResponse(res, error);
    }

    role.isDeleted = true;
    role.active = false;

    await role.save();

    const history = new RoleHistory({
        role_id: role._id,
        operation: config.operations.remove,
        operator: operator,
        prevObj: role,
        updatedObj: null,
        operation_date: new Date()

    });

    await history.save();
    return formatResponse(res, role);

};

export const removeAll = async (req, res) => {
    const operator = req.user;
    const roleIds = req.body.ids;
    const roles = await Role.find({ _id: { $in: roleIds } });

    if (roles.length) {
        const history = roles.map(role => ({
            role_id: role._id,
            operation: config.operations.remove,
            operator: operator,
            prevObj: role,
            updatedObj: null,
            operation_date: new Date()
        }));

        await RoleHistory.insertMany(history);
    }

    await Role.deleteMany({ _id: { $in: roleIds } });
    return formatResponse(res, roles);
};