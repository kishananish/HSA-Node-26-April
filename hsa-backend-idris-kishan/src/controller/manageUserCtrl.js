'use strict';

import User from '../models/User';
import UserHistory from '../models/UserHistory';
import formatResponse from '../../utils/formatResponse';
import config from '../../config/operationConfig';
import Service from '../models/Service';
import Role from '../models/Role';
import Review from '../models/Review';

export const getAll = async (req, res) => {
  const role = req.query.role;
  const items = req.query.items ? req.query.items : 10;
  const page = req.query.page ? req.query.page : 1;
  const skip = items * (page - 1);
  const limit = parseInt(items);
  const roleSearch =
    role && role !== 'user'
      ? {
          isDeleted: false,
          $and: [{ name: role }, { name: { $nin: ['admin', 'user'] } }],
        }
      : { isDeleted: false, name: { $nin: ['admin', 'user'] } };
  const foundRoles = await Role.find(roleSearch);
  const roleIds = foundRoles.map((role) => role.id);
  const searchData = { isDeleted: false, role: { $in: roleIds } };
  const count = await User.find(searchData).countDocuments();
  const users = await User.find(searchData)
    .sort({ created_at: 'DESC' })
    .populate('role', ['name'])
    .skip(skip)
    .limit(limit);
  let result = users;
  const userIds = users.map((user) => user._id);
  const filter = [
    { $project: { progress: 1, service_provider_id: 1 } },
    { $match: { service_provider_id: { $in: userIds } } },
    { $group: { _id: '$service_provider_id', count: { $sum: 1 } } },
  ];
  const servicesCountPromise = Service.aggregate(filter);
  const serviceProvidersRatingPromise = Review.aggregate([
    {
      $group: {
        _id: '$service_provider_id',
        rating: { $avg: '$service_provider_rating' },
      },
    },
  ]);
  const [servicesCount, serviceProvidersRating] = await Promise.all([
    servicesCountPromise,
    serviceProvidersRatingPromise,
  ]);
  let service_request = 0;
  let provider_avg_rating = 0;
  result = users.map((user) => {
    user = JSON.parse(JSON.stringify(user));
    servicesCount.map((serviceCount) => {
      if (user.userId === serviceCount._id) {
        service_request = serviceCount.count;
      }
    });
    serviceProvidersRating.forEach((serviceProviderRating) => {
      if (user.userId === serviceProviderRating._id) {
        provider_avg_rating = serviceProviderRating.rating
          ? serviceProviderRating.rating
          : 0;
      }
    });
    let newUser = Object.assign(user, { service_request, provider_avg_rating });
    return newUser;
  });

  const data = {
    total: count,
    pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
    result: result,
  };
  formatResponse(res, data);
};

export const getById = async (req, res) => {
  const id = req.params.id;
  const user = await User.find({ _id: id, isDeleted: false }).populate('role', [
    'name',
  ]);
  if (!user) {
    let error = new Error('User not found!');
    error.ar_message = 'المستخدم ليس موجود!';
    error.name = 'NotFound';
    return formatResponse(res, error);
  }
  formatResponse(res, user);
};

export const history = async (req, res) => {
  const items = req.query.items ? req.query.items : 10;
  const page = req.query.page ? page : 1;
  const skip = items * (page - 1);
  const limit = parseInt(items);

  const searchData = req.params.id ? { user_id: req.params.id } : {};

  const count = await UserHistory.find(searchData).countDocuments();
  const userHistory = await UserHistory.find(searchData)
    .sort({ operation_date: 'desc' })
    .populate('operator', ['first_name', 'last_name', 'email'])
    .populate('updatedObj.role', ['name'])
    .populate('prevObj.role', ['name'])
    .skip(skip)
    .limit(limit);

  const data = {
    total: count,
    pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
    result: userHistory,
  };
  formatResponse(res, data);
};
/**
 * @apidescription add new service provider user
 * @param {*} req
 * @param {*} res
 */
export const add = async (req, res) => {
  const operator = req.user;
  req.body.active = true;

  const email = req.body.email.toLowerCase();
  const roleName = req.body.role;

  let foundUser = await User.find({
    mobile_no: req.body.mobile_no,
    active: true,
  });

  if (foundUser.length >= 1) {
    let error = new Error('Mobile No already in use!');
    error.ar_message = 'البريد الاليكتروني قيد الاستخدام!';
    error.name = 'userExist';
    return formatResponse(res, error);
  }

  const foundRole = await Role.find({
    $and: [{ name: roleName }, { name: { $ne: 'user' } }],
  });

  if (!foundRole) {
    let error = new Error('Role not found!');
    error.ar_message = 'الدور غير موجود!';
    error.name = 'NotFound';
    return formatResponse(res, error);
  }

  if (foundUser) {
    req.body.isDeleted = false;
    // if (foundUser.role.indexOf(foundRole._id) === -1) {
    // 	foundUser.role.push(foundRole._id);
    // }
    // delete req.body.role;
    req.body.role = foundRole[0]._id;
    //foundUser.set(req.body);
    // let registeredUser = await foundUser.save();
    // return formatResponse(res, registeredUser);
  }

  req.body.role = foundRole[0]._id;
  const newCustomer = await User.create(req.body);

  // const history = new UserHistory({
  //   user_id: newCustomer._id,
  //   operation: config.operations.add,
  //   operator: operator,
  //   prevObj: null,
  //   updatedObj: newCustomer,
  //   operation_date: new Date(),
  // });

  //await history.save();
  formatResponse(res, newCustomer);
};

export const createserviceprovider = async (req, res) => {
  var roleName = 'service_provider';
  req.body.active = true;

  let foundUser = await User.find({
    mobile_no: req.body.mobile_no,
    active: true,
  });

  if (foundUser.length >= 1) {
    let error = new Error('Mobile No already in use!');
    error.ar_message = 'البريد الاليكتروني قيد الاستخدام!';
    error.name = 'userExist';
    return formatResponse(res, error);
  }

  const foundRole = await Role.find({
    $and: [{ name: roleName }, { name: { $ne: 'user' } }],
  });

  if (!foundRole) {
    let error = new Error('Role not found!');
    error.ar_message = 'الدور غير موجود!';
    error.name = 'NotFound';
    return formatResponse(res, error);
  }

  if (foundUser) {
    req.body.isDeleted = false;
    // if (foundUser.role.indexOf(foundRole._id) === -1) {
    //   foundUser.role.push(foundRole._id);
    // }
    //delete req.body.role;
    req.body.role = foundRole[0]._id;

    //foundUser.set(req.body);
    // let registeredUser = await foundUser.save();
    // return formatResponse(res, registeredUser);
  }

  req.body.role = foundRole[0]._id;

  const newCustomer = await User.create(req.body);

  // const history = new UserHistory({
  //   user_id: newCustomer._id,
  //   operation: config.operations.add,
  //   operator: operator,
  //   prevObj: null,
  //   updatedObj: newCustomer,
  //   operation_date: new Date(),
  // });

  //await history.save();
  formatResponse(res, newCustomer);
};

export const updateUser = async (req, res) => {
  const operator = req.user;
  const id = req.params.id;
  const roleName = req.body.role;

  let foundCustomer = await User.findById(id);

  if (!foundCustomer) {
    let error = new Error('Customer not be registered!');
    error.ar_message = 'الزبون غير مسجل!';
    error.name = 'userExist';
    return formatResponse(res, error);
  }
  const foundRole = await Role.findOne({ name: roleName });

  if (!foundRole) {
    let error = new Error('Role not found!');
    error.ar_message = 'الدور غير موجود!';
    error.name = 'NotFound';
    return formatResponse(res, error);
  }

  const origObj = foundCustomer.toObject();
  req.body.email = req.body.email.toLowerCase();
  foundCustomer.role = foundRole._id;
  // if (foundCustomer.role.indexOf(foundRole._id) === -1) {
  // 	foundCustomer.role.push(foundRole._id);
  // }
  delete req.body.role;
  foundCustomer.set(req.body);
  const updatedCustomer = await foundCustomer.save();

  const history = new UserHistory({
    user_id: foundCustomer._id,
    operation: config.operations.update,
    operator: operator,
    prevObj: origObj,
    updatedObj: updatedCustomer,
    operation_date: new Date(),
  });

  await history.save();
  formatResponse(res, updatedCustomer);
};

export const remove = async (req, res) => {
  //const operator = req.user;
  const id = req.params.id;
  const foundUser = await User.find({ _id: id });
  if (!foundUser) {
    let error = new Error('Customer not found!');
    error.ar_message = 'العميل غير موجود!';
    error.name = 'NotFound';
    return formatResponse(res, error);
  }

  foundUser.isDeleted = true;

  await User.update({ _id: id }, { isDeleted: true, active: false });
  await UserHistory.remove({ user_id: id });

  // const history = new UserHistory({
  // 	user_id: foundUser._id,
  // 	operation: config.operations.remove,
  // 	operator: operator,
  // 	prevObj: foundUser,
  // 	updatedObj: null,
  // 	operation_date: new Date()
  // });

  // await history.save();
  formatResponse(res, foundUser);
};

export const removeAll = async (req, res) => {
  //const operator = req.user;
  const userIds = req.body.ids;
  const users = await User.findOne({ _id: { $in: userIds } });
  // if (users.length) {

  // 	const userHistory = users.map(user => ({
  // 		user_id: user._id,
  // 		first_name: user.first_name,
  // 		last_name: user.last_name,
  // 		operation: config.operations.remove,
  // 		operator: operator,
  // 		prevObj: user,
  // 		updatedObj: null,
  // 		operation_date: new Date(),
  // 	}));

  // 	await UserHistory.insertMany(userHistory);
  // }
  let user_mobile = users.mobile_no;
  let mobile_no = users.mobile_no + new Date();
  await User.update(
    { _id: { $in: userIds } },
    {
      isDeleted: true,
      active: false,
      mobile_no: mobile_no,
      old_mobile_no: user_mobile,
    },
    { multi: true }
  );

  await UserHistory.remove({ user_id: { $in: userIds } });
  return formatResponse(res, users);
};
