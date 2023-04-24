import jwt from 'jsonwebtoken';
import User from '../models/User';
import Role from '../models/Role';
import config from '../../config/config';
import formatResponse from '../../utils/formatResponse';
import * as otpService from '../../utils/otpService';
//import { snsSendSMS } from "../handler/AWSService";
const sendSms = require('../handler/twilio');
import * as mail from '../handler/mail';
import logger from '../../utils/logger';

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
  // console.log('req body=========', req.body);
  const foundUser = await User.findOne({
    mobile_no: mobile_no,
    isDeleted: false,
    active: true,
  });
  // console.log('foundUser=========', foundUser);
  if (foundUser && foundUser.country_code != country_code) {
    let error = new Error('You might have provided an incorrect country code');
    error.ar_message = 'ربما قدمت رمز بلد غير صحيح';
    error.name = 'DataNotFound';
    return formatResponse(res, error);
  }
  let checkRole;
  let role;
  if (foundUser && foundUser.role.length) {
    role = await Role.findOne({ _id: foundUser.role[0] });
    console.log('role :', role);
    checkRole = role.name;
  }
  // ;
  // console.log('checkRole==========', checkRole);

  if (!foundUser) {
    let error = new Error('Mobile number not registered!');
    error.ar_message = 'رقم الجوال غير مسجل!';
    error.name = 'DataNotFound';
    return formatResponse(res, error);
  }

  if (checkRole != 'service_provider') {
    let error = new Error('User does\'nt have role to access this service');
    error.ar_message = 'رقم الجوال غير مسجل!';
    error.name = 'ValidationError';
    return formatResponse(res, error);
  }

  let isPermission = false;
  if (role.name === config.authTypes.SERVICE_PROVIDER) {
    isPermission = true;
  }
  if (!isPermission) {
    let error = new Error('Mobile number not registered!');
    error.ar_message = 'رقم الجوال غير مسجل!';
    error.name = 'DataNotFound';
    return formatResponse(res, error);
  }
  const otp = otpService.generateOtp();
  console.log(`OTP for ${mobile_no} = ${otp}`);

  const params = {
    Message: `Your HSA One Time Password is ${otp}, HSA team`,
    PhoneNumber: `${country_code}${mobile_no}`,
  };
  console.log(`params ==> ${params}`);

  // await snsSendSMS(params);

  const valid_no = '+' + country_code + mobile_no;

  sendSms(valid_no, params.Message);

  // //console.log("4"+foundUser);
  // mail.send({
  //   user: foundUser,
  //   subject: "One Time Password for HSA",
  //   filename: "otp",
  //   otp,
  // });
  formatResponse(res, {
    message: 'OTP sent on your mobile number',
    otp: otp,
    ar_message: 'أرسلت OTP على رقم هاتفك المحمول',
  });
};

export const mobileSignin = async (req, res) => {
  const mobile_no = req.body.mobile_no;
  const otp = req.body.otp;
  let response = {};
  //const otpVerified = otpService.verifyOtp(otp);

  const otpVerified = true;
  // logger.info(mobile_no, otp, otpVerified);
  // console.log('mobileSignin ===>', mobile_no, otp, otpVerified);
  if (otpVerified) {
    let foundUser = await User.findOne({
      mobile_no: mobile_no,
      isDeleted: false,
      active: true,
    })
      .populate('role')
      .populate('category_id');
    if (!foundUser) {
      let error = new Error('Unauthorized User!');
      error.ar_message = 'مستخدم غير مصرح به!';
      error.name = 'AuthenticationError';
      return formatResponse(res, error);
    }
    let isPermission = false;
    foundUser.role.map((role) => {
      if (role.name === config.authTypes.SERVICE_PROVIDER) {
        isPermission = true;
      }
    });
    if (!isPermission) {
      let error = new Error('Mobile number not registered!');
      error.ar_message = 'رقم الجوال غير مسجل!';
      error.name = 'DataNotFound';
      return formatResponse(res, error);
    }
    if (!foundUser.active) {
      let error = new Error('User Not Active!');
      error.ar_message = 'العضو غير نشط!';
      error.name = 'userInactive';
      return formatResponse(res, error);
    }
    foundUser.device_id = req.body.device_id;
    await foundUser.save();
    foundUser = foundUser.toObject();
    foundUser.token = createToken(foundUser);
    formatResponse(res, foundUser);
  } else {
    response = {
      status: 'error',
      message: 'Otp not verified',
    };
    formatResponse(res, response);
  }
};

export const resendOtp = async (req, res) => {
  const mobile_no = req.body.mobile_no;
  const country_code = req.body.country_code;

  const foundUser = await User.findOne({
    mobile_no: mobile_no,
    isDeleted: false,
    active: true,
  });

  if (foundUser && foundUser.country_code != country_code) {
    let error = new Error('You might have provided an incorrect country code');
    error.ar_message = 'ربما قدمت رمز بلد غير صحيح';
    error.name = 'DataNotFound';
    return formatResponse(res, error);
  }

  if (!foundUser) {
    let error = new Error('Mobile number not registered!');
    error.ar_message = 'رقم الجوال غير مسجل!';
    error.name = 'DataNotFound';
    return formatResponse(res, error);
  }

  const otp = otpService.generateOtp();
  console.log(`OTP for ${mobile_no} = ${otp}`);

  const params = {
    Message: `Your HSA One Time Password is ${otp}, HSA team`,
    PhoneNumber: `${country_code}${mobile_no}`,
  };

  if (foundUser) {
    mail.send({
      user: foundUser,
      subject: 'One Time Password for HSA',
      filename: 'otp',
      otp,
    });
  }

  //await snsSendSMS(params);

  const valid_no = '+' + country_code + mobile_no;

  sendSms(valid_no, params.Message);

  //console.log("5"+foundUser);
  formatResponse(res, {
    message: 'OTP sent on your mobile number777',
    otp: otp,
  });
};

export const editUser = async (req, res) => {
  const userId = req.user;
  const user = await User.findById(userId).populate('category_id');
  if (!user) {
    let error = new Error('User not found!');
    error.ar_message = 'المستخدم ليس موجود!';
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
  let user = await User.findById(userId).populate('category_id');
  if (!user) {
    let error = new Error('User not found!');
    error.ar_message = 'المستخدم ليس موجود!';
    error.name = 'DataNotFound';
    return formatResponse(res, error);
  }
  user = user.toObject();
  formatResponse(res, user);
};

export const addAddress = async (req, res) => {
  console.log('req.body.addresses==');
  console.log(req.body.addresses);
  console.log('==req.body.addresses');

  const userId = req.user;
  const user = await User.findById(userId);
  if (!user) {
    let error = new Error('User not found!');
    error.ar_message = 'المستخدم ليس موجود!';
    error.name = 'DataNotFound';
    return formatResponse(res, error);
  }
  req.body.addresses.forEach((address) => {
    console.log('address==');
    console.log(address);
    console.log('==address');
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
