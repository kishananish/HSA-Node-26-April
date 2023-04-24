'use strict';

/**
 * Deprecated not more, as i have marge both user module only
 *
 */

import User from '../models/User';

import formatResponse from '../../utils/formatResponse';

export const getAll = async (req, res) => {
  //TODO: pending for aggregate service request

  const items = req.query.items ? req.query.items : 10;
  const page = req.query.page ? req.query.page : 1;
  const skip = items * (page - 1);
  const limit = parseInt(items);

  const count = await User.find({ role: 'user' }).countDocuments();
  const users = await User.find({ role: 'user' })
    .skip(skip)
    .limit(limit);

  const data = {
    total: count,
    pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
    result: users,
  };

  formatResponse(res, data);
};

export const getById = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findOne({ _id: userId, role: 'user' });
  if (!user) {
    let error = new Error('User not found!');
    error.name = 'NotFound';
    return formatResponse(res, error);
  }

  formatResponse(res, user);
};

export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  const foundUser = await User.findOne({ _id: userId });
  if (!foundUser) {
    let error = new Error('Customer not found!');
    error.name = 'NotFound';
    return formatResponse(res, error);
  }

  foundUser.isDeleted = true;

  await User.update({ _id: userId }, { isDeleted: true, active: false });

  formatResponse(res, {});
};

export const add = async (req, res) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  let foundUser = await User.findOne({ email: email }, '+password');

  if (foundUser) {
    let error = new Error('Customer Already registered!');
    error.name = 'userExist';
    return formatResponse(res, error);
  }

  const newUser = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: email,
    password: password,
    country_code: null,
    google_id: null,
    facebook_id: null,
    mobile_no: req.body.mobile_no,
    addresses: req.body.addresses,
    role: 'user',
    country: null,
    city: null,
    preferred_language: req.body.preferred_language,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    active: true,
    isDeleted: false,
    device_id: null,
    dateOfJoining: null,
    credits: req.body.credits,
    rating: 0,
    status: req.body.active,
    created_at: new Date(),
    updated_at: null,
  });

  const newCustomer = await newUser.save();
  formatResponse(res, newCustomer);
};

export const update = async (req, res) => {
  const id = req.params.id;
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  let foundCustomer = await User.findOne({ _id: id }, '+password');

  if (!foundCustomer) {
    let error = new Error('Customer not registered!');
    error.name = 'userExist';
    return formatResponse(res, error);
  }

  const isMatch = await foundCustomer.comparePassword(password);
  if (!isMatch) {
    foundCustomer.password = password;
  }

  foundCustomer.first_name = req.body.first_name;
  foundCustomer.last_name = req.body.last_name;
  foundCustomer.email = email;
  foundCustomer.mobile_no = req.body.mobile_no;
  foundCustomer.password = password;
  foundCustomer.addresses = req.body.addresses;
  foundCustomer.preferred_language = req.body.preferred_language;
  foundCustomer.credits = req.body.credits;
  foundCustomer.rating = req.body.rating;
  foundCustomer.status = req.body.status;
  foundCustomer.dateOfJoining = null;
  foundCustomer.updated_at = new Date();

  const updatedCustomer = await foundCustomer.save();
  formatResponse(res, updatedCustomer);
};
