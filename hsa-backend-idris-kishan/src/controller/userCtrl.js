import jwt from 'jsonwebtoken';
import axios from 'axios';

import User from '../models/User';
import logger from '../../utils/logger';
import config from '../../config/config';
import formatResponse from '../../utils/formatResponse';
import * as otpService from '../../utils/otpService';
import { snsSendSMS } from '../handler/AWSService';
const sendSms = require('../handler/twilio');
import Role from '../models/Role';
import Service from '../models/Service';
import * as mail from '../handler/mail';

const createToken = (user) => {
  const payload = {
    iss: 'home_service',
    sub: user.userId,
    iat: Math.floor(Date.now() / 1000) - 30,
    exp: Math.floor(Date.now() / 1000) + 86400000,
  };
  return jwt.sign(payload, config.JWT_SECRET);
};

export const sendOtp = async (req, res) => {
  const mobile_no = req.body.mobile_no;
  const country_code = req.body.country_code;
  let foundUser = await User.findOne({ mobile_no: mobile_no });
  // if (foundUser) {
  // 	let error = new Error('Mobile number already registered!');
  // 	error.name = 'userExist';
  // 	return formatResponse(res, error);
  // }
  const otp = otpService.generateOtp();
  const params = {
    Message: `Your OTP is ${otp} sent at ${new Date()} by HSA`,
    PhoneNumber: `${country_code}${mobile_no}`,
    Subject: 'HSA',
  };
  // await snsSendSMS(params, (err, done) => {
  //   console.log(err);
  // });

  const valid_no = '+' + country_code + mobile_no;

  sendSms(valid_no, params.Message);

  //console.log("6"+foundUser);
  if (foundUser)
    mail.send({
      user: foundUser,
      subject: 'One Time Password for HSA',
      filename: 'otp',
      otp,
    });

  formatResponse(res, {});
};

export const verifyOtp = async (req, res) => {
  const country_code = req.body.country_code;
  const mobile_no = req.body.mobile_no;
  const otp = req.body.otp;
  let response = {};
  const otpVerified = otpService.verifyOtp(otp);
  if (otpVerified) {
    const foundUser = await User.findOne({ mobile_no: mobile_no });
    if (foundUser) {
      let existingData = {
        country_code: country_code,
        mobile_no: mobile_no,
        active: true,
        isDeleted: false,
      };
      foundUser.set(existingData);
      let registeredUser = await foundUser.save();
      registeredUser = registeredUser.toObject();
      registeredUser.message = 'Otp verified';
      return formatResponse(res, registeredUser);
    } else {
      const createUser = await User.create({
        country_code: country_code,
        mobile_no: mobile_no,
        active: true,
      });
      createUser.message = 'Otp verified';
      formatResponse(res, createUser);
    }
  } else {
    response = {
      status: 'error',
      message: 'Entered OTP is not correct. Please enter the Correct OTP',
    };
    formatResponse(res, response);
  }
};

export const generateOtp = async (req, res) => {
  const mobile_no = req.body.mobile_no;
  const country_code = req.body.country_code;

  let foundUser = await User.findOne({
    mobile_no: mobile_no,
    isDeleted: false,
    active: true,
  });

  if (foundCustomer && foundCustomer.country_code != country_code) {
    let error = new Error('You might have provided an incorrect country code');
    error.name = 'DataNotFound';
    return formatResponse(res, error);
  }

  if (!foundUser) {
    let error = new Error('Mobile number not registered!');
    error.name = 'DataNotFound';
    return formatResponse(res, error);
  }
  const otp = otpService.generateOtp();

  const params = {
    Message: `Your HSA One Time Password is ${otp} send by HSA team`,
    PhoneNumber: `${country_code}${mobile_no}`,
  };

  // await snsSendSMS(params);

  const valid_no = '+' + country_code + mobile_no;

  sendSms(valid_no, params.Message);

  //console.log("7"+foundUser);
  mail.send({
    user: foundUser,
    subject: 'One Time Password for HSA',
    filename: 'otp',
    otp,
  });
  formatResponse(res, {});
};

export const mobileSignin = async (req, res) => {
  const mobile_no = req.body.mobile_no;
  const otp = req.body.otp;
  const device_id = req.body.device_id;
  const device_type = req.body.device_type;
  let response = {};
  const otpVerified = otpService.verifyOtp(otp);

  if (otpVerified) {
    let foundUser = await User.findOne({
      mobile_no: mobile_no,
      isDeleted: false,
      active: true,
    }).populate('role');
    if (!foundUser) {
      let error = new Error('Unauthorized!');
      error.name = 'AuthenticationError';
      return formatResponse(res, error);
    }
    let isPermission = false;
    foundUser.role.map((role) => {
      if (role.name === config.authTypes.USER) {
        isPermission = true;
      }
    });
    if (!isPermission) {
      let error = new Error('Unauthorized!');
      error.name = 'AuthenticationError';
      return formatResponse(res, error);
    }
    foundUser.device_id = device_id ? device_id : foundUser.device_id;
    foundUser.device_type = device_type ? device_type : foundUser.device_type;
    await foundUser.save();
    foundUser = foundUser.toObject();
    foundUser.token = createToken(foundUser);
    formatResponse(res, foundUser);
  } else {
    response = {
      status: 'error',
      message: 'Entered OTP is not correct. Please enter the Correct OTP',
    };
    formatResponse(res, response);
  }
};

export const mobileSignup = async (req, res) => {
  const user = await User.findById(req.body.txnId);
  if (!user) {
    let error = new Error('Wrong txtId!');
    error.name = 'DataNotFound';
    return formatResponse(res, error);
  }
  const foundRole = await Role.findOne({ name: 'user' });
  req.body.role = foundRole._id;
  req.body.active = true;
  user.set(req.body);
  let registeredUser = await user.save();
  registeredUser = registeredUser.toObject();
  registeredUser.token = createToken(registeredUser);
  registeredUser.message = 'Customer registered successfully.';
  formatResponse(res, registeredUser);
};

export const editUser = async (req, res) => {
  const userId = req.user;
  const user = await User.findById(userId);
  if (!user) {
    let error = new Error('User not found!');
    error.name = 'DataNotFound';
    return formatResponse(res, error);
  }
  user.set({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    city: req.body.city,
    preferred_language: req.body.preferred_language,
  });
  let updatedUser = await user.save();
  updatedUser = updatedUser.toObject();
  formatResponse(res, updatedUser);
};

export const getUser = async (req, res) => {
  const userId = req.user;
  let user = await User.findById(userId);
  if (!user) {
    let error = new Error('User not found!');
    error.name = 'DataNotFound';
    return formatResponse(res, error);
  }
  user = user.toObject();
  formatResponse(res, user);
};

export const facebookLogin = async (req, res) => {
  try {
    const graphApiUrl = 'https://graph.facebook.com/v7.0/me';
    const params = {
      access_token: req.body.access_token,
      fields: 'id,name,email,picture,first_name,last_name',
    };
    // Step 1. Exchange authorization code for access token.

    // Step 2. Retrieve profile information about the current user.
    const fbData = await axios.get(graphApiUrl, { params: params });
    const profile = fbData.data;
    // Step 3. Create a new user account or return an existing one.
    let foundUser = await User.findOne({ facebook_id: profile.id });
    if (foundUser) {
      foundUser = foundUser.toObject();
      foundUser.token = createToken(foundUser);
      return formatResponse(res, foundUser);
    }
    const foundRole = await Role.findOne({ name: 'user' });
    let user = new User();
    user.first_name = profile.first_name;
    user.last_name = profile.last_name;
    user.facebook_id = profile.id;
    user.role = foundRole._id;
    user.active = true;
    // user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
    let savedUser = await user.save();
    savedUser = savedUser.toObject();
    savedUser.token = createToken(savedUser);
    return formatResponse(res, savedUser);
  } catch (err) {
    if (err.response.data) {
      logger.error(err.response.data);
      const formatError = err.response.data.error
        ? err.response.data.error.message
        : '';
      const error = new Error(formatError);
      error.name = 'OAuthException';
      return formatResponse(res, error);
    }
    logger.error(err);
    return res.status(500).send({ err: err });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const peopleApiUrl =
      'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
    const params = {
      access_token: req.body.access_token,
    };
    // Step 1. Exchange authorization code for access token.

    // Step 2. Retrieve profile information about the current user.
    const googleData = await axios.get(peopleApiUrl, { params: params });
    const profile = googleData.data;
    let foundUser = await User.findOne({ google_id: profile.sub });
    if (foundUser) {
      foundUser = foundUser.toObject();
      foundUser.token = createToken(foundUser);
      return formatResponse(res, foundUser);
    }
    const foundRole = await Role.findOne({ name: 'user' });
    let user = new User();
    user.first_name = profile.given_name;
    user.last_name = profile.family_name;
    user.google_id = profile.sub;
    user.email = profile.email;
    // user.picture = profile.picture.replace('sz=50', 'sz=200');
    user.role = foundRole._id;
    user.active = true;
    let savedUser = await user.save();
    savedUser = savedUser.toObject();
    savedUser.token = createToken(savedUser);
    return formatResponse(res, savedUser);
  } catch (err) {
    if (err.response) {
      logger.error(err.response.data);
      const formatError = err.response.data.error
        ? err.response.data.error.message
        : '';
      const error = new Error(formatError);
      error.name = 'OAuthException';
      return formatResponse(res, error);
    }
    logger.error(err);
    return res.status(500).send({ err: {} });
  }
};

export const appleLogin = async (req, res) => {
  console.log('wowwwww');
  try {
    // const peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
    // const params = {
    //     access_token: req.body.access_token,
    // };
    // Step 1. Exchange authorization code for access token.

    // Step 2. Retrieve profile information about the current user.
    // const googleData = await axios.get(peopleApiUrl, { params: params });
    // const profile = googleData.data;
    let foundUser = await User.findOne({ apple_id: req.body.user });
    console.log('user : ', foundUser);
    if (foundUser) {
      foundUser = foundUser.toObject();
      foundUser.token = createToken(foundUser);
      return formatResponse(res, foundUser);
    }
    const foundRole = await Role.findOne({ name: 'user' });
    let user = new User();
    user.first_name = req.body.given_name;
    user.last_name = req.body.family_name;
    user.apple_id = req.body.user;
    user.email = req.body.email;
    user.role = foundRole._id;
    user.active = true;
    let savedUser = await user.save();
    savedUser = savedUser.toObject();
    savedUser.token = createToken(savedUser);
    return formatResponse(res, savedUser);
  } catch (err) {
    if (err.response) {
      logger.error(err.response.data);
      const formatError = err.response.data.error
        ? err.response.data.error.message
        : '';
      const error = new Error(formatError);
      error.name = 'OAuthException';
      return formatResponse(res, error);
    }
    logger.error(err);
    return res.status(500).send({ err: {} });
  }
};

export const addAddress = async (req, res) => {
  const userId = req.user;
  const user = await User.findById(userId);
  if (!user) {
    let error = new Error('User not found!');
    error.name = 'DataNotFound';
    return formatResponse(res, error);
  }
  req.body.addresses.forEach((address) => {
    user.addresses.push(address);
  });
  let updatedUser = await user.save();
  updatedUser = updatedUser.toObject();
  formatResponse(res, updatedUser);
};

export const updateAddress = async (req, res) => {
  const userId = req.user;
  const updatedData = await User.findOneAndUpdate(
    {
      _id: userId,
      'addresses._id': req.params.addressId,
    },
    {
      $set: {
        'addresses.$.type': req.body.type,
        'addresses.$.address': req.body.address,
        'addresses.$.city': req.body.city,
        'addresses.$.mapAddress': req.body.mapAddress,
        'addresses.$.zipcode': req.body.zipcode,
        'addresses.$.country': req.body.country,
        'addresses.$.location.coordinates': req.body.location.coordinates,
        'addresses.$.location.type': req.body.location.type,
        'addresses.$.isDefault': req.body.isDefault,
      },
    },
    { new: true }
  );
  formatResponse(res, updatedData ? updatedData : {});
};

export const deleteAddress = async (req, res) => {
  const userId = req.user;
  const updatedData = await User.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );
  formatResponse(res, updatedData ? updatedData : {});
};

export const getCustomerList = async (req, res) => {
  const items = req.query.items ? req.query.items : 10;
  const page = req.query.page ? req.query.page : 1;
  const skip = items * (page - 1);
  const limit = parseInt(items);
  const roleSearch = {
    isDeleted: false,
    $and: [{ name: 'user' }, { name: { $ne: 'admin' } }],
  };
  const foundRoles = await Role.find(roleSearch);
  const roleIds = foundRoles.map((role) => role.id);
  const searchData = { isDeleted: false, role: { $in: roleIds } };
  const count = await User.find(searchData).countDocuments();
  const users = await User.find(searchData)
    .populate('role', ['name'])
    .skip(skip)
    .limit(limit);
  let result = users;

  const userIds = users.map((user) => user._id);
  const filter = [
    { $project: { progress: 1, service_provider_id: 1 } },
    { $match: { service_provider_id: { $in: userIds } } },
    { $group: { _id: '$progress', count: { $sum: 1 } } },
  ];
  const servicesCount = await Service.aggregate(filter);
  let done = 0;
  let accepted = 0;
  let declined = 0;
  result = users.map((user) => {
    user = JSON.parse(JSON.stringify(user));
    servicesCount.map((serviceCount) => {
      done =
        serviceCount._id === 'task_done' ||
        serviceCount._id === 'payment_done' ||
        serviceCount._id === 'review'
          ? serviceCount.count + done
          : done;

      accepted =
        serviceCount._id === 'accepted' ||
        serviceCount._id === 'quote_provided' ||
        serviceCount._id === 'quote_accepted' ||
        serviceCount._id === 'quote_rejected' ||
        serviceCount._id === 'leave_for_the_job' ||
        serviceCount._id === 'ongoing' ||
        serviceCount._id === 'task_done' ||
        serviceCount._id === 'payment_done' ||
        serviceCount._id === 'review'
          ? serviceCount.count + accepted
          : accepted;

      declined =
        serviceCount._id === 'rejected'
          ? serviceCount.count + declined
          : declined;
    });
    let newUser = Object.assign(user, {
      service_completed: 0,
      service_cancelled: 0,
    });
    return newUser;
  });

  const data = {
    total: count,
    pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
    result: result,
  };

  formatResponse(res, data);
};
