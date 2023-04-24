import jwt from 'jsonwebtoken';
import axios from 'axios';

import Customer from '../models/Customer';
import Provider from '../models/User';
import logger from '../../utils/logger';
import config from '../../config/config';
import operationConfig from '../../config/operationConfig';
import formatResponse from '../../utils/formatResponse';
import * as otpService from '../../utils/otpService';
import { snsSendSMS, sesSendEmail } from '../handler/AWSService';
const sendSms = require('../handler/twilio');
//import { sendSms } from "../handler/twilio";
import Role from '../models/Role';
import Service from '../models/Service';
import CustomerHistory from '../models/CustomerHistory';
import ServiceActivity from '../models/ServiceActivity';
import Review from '../models/Review';
import * as mail from '../handler/mail';
import Configuration from '../models/Configuration';
import constants from '../../utils/constants';
import appleSignin from 'apple-signin-auth';

const createToken = (user) => {
  const payload = {
    iss: 'home_service',
    sub: user.userId,
    iat: Math.floor(Date.now() / 1000) - 30,
    exp: Math.floor(Date.now() / 1000) + 86400000,
    language: user.preferred_language,
  };
  return jwt.sign(payload, config.JWT_SECRET);
};

/**
 * Initial Registration API with OTP sending feature
 * @param {*} req
 * @param {*} res
 */
export const sendOtp = async (req, res) => {
  const mobile_no = req.body.mobile_no;
  const country_code = req.body.country_code;
  let foundCustomer = await Customer.findOne({ mobile_no: mobile_no });

  const otp = otpService.generateOtp();

  const params = {
    Message: `Your HSA One Time Password is ${otp}, HSA team`,
    PhoneNumber: `${country_code}${mobile_no}`,
  };
  if (foundCustomer && foundCustomer.email) {
    mail.send({
      user: foundCustomer,
      subject: 'One Time Password for HSA',
      filename: 'otp',
      otp,
    });
  }
  //await snsSendSMS(params);
  //console.log("1"+foundCustomer);

  const valid_no = '+' + country_code + mobile_no;

  sendSms(valid_no, params.Message);

  formatResponse(res, {
    message: 'OTP sent on your mobile number',
    otp: otp,
  });
};

export const sendProviderOtp = async (req, res) => {
  const mobile_no = req.body.mobile_no;
  const country_code = req.body.country_code;
  let foundUser = await Provider.findOne({ mobile_no: mobile_no });

  const otp = otpService.generateOtp();

  const params = {
    Message: `Your HSA One Time Password is ${otp}, HSA team`,
    PhoneNumber: `${country_code}${mobile_no}`,
  };
  if (foundUser && foundUser.email) {
    mail.send({
      user: foundUser,
      subject: 'One Time Password for HSA',
      filename: 'otp',
      otp,
    });
  }
  await snsSendSMS(params);

  formatResponse(res, {
    message: 'OTP sent on your mobile number',
    otp: otp,
  });
};

/**
 * API to verify the OTP after creating initial user doc with just contact no
 * @param {*} req
 * @param {*} res
 */
export const verifyOtp = async (req, res) => {
  const country_code = req.body.country_code;
  const mobile_no = req.body.mobile_no;
  const otp = req.body.otp;
  const email = req.body.email;
  let response = {};
  // const otpVerified = await otpService.verifyOtp(otp);
  const otpVerified = true;

  if (otpVerified) {
    const foundCustomer = await Customer.findOne({
      mobile_no: mobile_no,
      isDeleted: false,
      facebook_id: { $exists: false },
    });

    if (foundCustomer) {
      let existingData = {
        country_code: country_code,
        mobile_no: mobile_no,
        email: email,
        isDeleted: false,
      };
      foundCustomer.set(existingData);
      let registeredCustomer = await foundCustomer.save();
      registeredCustomer = registeredCustomer.toObject();
      registeredCustomer.user = foundCustomer;
      registeredCustomer.isVerified = true;
      registeredCustomer.message = 'Otp verified';
      return formatResponse(res, registeredCustomer);
    } else {
      let newCustomer = {};
      let createCustomer = await Customer.create(
        {
          country_code: country_code,
          mobile_no: mobile_no,
          email: email,
        },
        (err, user) => {
          newCustomer.message = 'Otp verified';
          newCustomer.isVerified = true;
          newCustomer.user = user;
          formatResponse(res, newCustomer);
        }
      );
    }
  } else {
    response = {
      status: 'error',
      message: 'Entered OTP is not correct. Please enter the Correct OTP',
    };
    formatResponse(res, response);
  }
};

export const providerVerifyOtp = async (req, res) => {
  const country_code = req.body.country_code;
  const mobile_no = req.body.mobile_no;
  const otp = req.body.otp;
  const email = req.body.email;
  let response = {};
  // const otpVerified = await otpService.verifyOtp(otp);
  const otpVerified = true;

  if (otpVerified) {
    const foundCustomer = await Provider.findOne({
      mobile_no: mobile_no,
      isDeleted: false,
      facebook_id: { $exists: false },
    });

    if (foundCustomer) {
      let existingData = {
        country_code: country_code,
        mobile_no: mobile_no,
        email: email,
        isDeleted: false,
      };
      foundCustomer.set(existingData);
      let registeredCustomer = await foundCustomer.save();
      registeredCustomer = registeredCustomer.toObject();
      registeredCustomer.user = foundCustomer;
      registeredCustomer.isVerified = true;
      registeredCustomer.message = 'Otp verified';
      return formatResponse(res, registeredCustomer);
    } else {
      let newCustomer = {};
      let createCustomer = await Customer.create(
        {
          country_code: country_code,
          mobile_no: mobile_no,
          email: email,
        },
        (err, user) => {
          newCustomer.message = 'Otp verified';
          newCustomer.isVerified = true;
          newCustomer.user = user;
          formatResponse(res, newCustomer);
        }
      );
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

  let foundCustomer = await Customer.find({
    mobile_no: mobile_no,
  });

  // if(foundCustomer && foundCustomer.isDeleted) {
  //     let error = new Error('This user has been inactivated');
  //     error.name = 'userInactive';
  //     error.ar_message = 'تم تعطيل هذا المستخدم';
  //     return formatResponse(res, error);
  // }
  //   if (foundCustomer && foundCustomer.country_code != country_code) {
  //     let error = new Error("You might have provided an incorrect country code");
  //     error.name = "DataNotFound";
  //     error.ar_message = "ربما قدمت رمز بلد غير صحيح";
  //     return formatResponse(res, error);
  //   }
  if (!foundCustomer) {
    let error = new Error('User not found!');
    error.name = 'DataNotFound';
    error.ar_message = 'المستخدم ليس موجود!';
    return formatResponse(res, error);
  }
  const otp = await otpService.generateOtp();

  const params = {
    Message: `Please enter the following code ${otp} to access your Hameed Service account`,
    PhoneNumber: `${country_code}${mobile_no}`,
  };
  snsSendSMS(params);

  if (foundCustomer && !foundCustomer.email) {
    formatResponse(res, {
      message: 'OTP sent on your mobile number222',
      otp: otp,
      ar_message: 'أرسلت OTP على رقم هاتفك المحمول',
    });
  }
  if (foundCustomer && foundCustomer.email) {
    console.log('**********************');
    //await sesSendEmail({ user: foundCustomer, subject: 'One Time Password for HSA', filename: 'otp', otp });
    mail.send({
      user: foundCustomer,
      subject: 'One Time Password for HSA',
      filename: 'otp',
      otp,
    });
    formatResponse(res, {
      message: 'OTP sent on your mobile number333',
      otp: otp,
      ar_message: 'أرسلت OTP على رقم هاتفك المحمول',
    });
  }
};

export const mobileSignin = async (req, res) => {
  const mobile_no = req.body.mobile_no;
  const otp = req.body.otp;
  const device_id = req.body.device_id;

  const device_type = req.body.device_type;

  let response = {};
  // const otpVerified = otpService.verifyOtp(otp);

  const otpVerified = true;
  if (otpVerified) {
    let foundCustomer = await Customer.findOne({
      mobile_no: mobile_no,
      isDeleted: false,
    }).populate('role');

    if (!foundCustomer) {
      let error = new Error('This user has been inactivated');
      error.name = 'userInactive';
      error.ar_message = 'تم تعطيل هذا المستخدم';
      return formatResponse(res, error);
    }
    let isPermission = false;
    foundCustomer.role.map((role) => {
      if (role.name === config.authTypes.USER) {
        isPermission = true;
      }
    });
    if (!isPermission) {
      let error = new Error('Unauthorized!');
      error.name = 'AuthenticationError';
      error.ar_message = 'غير مصرح';
      return formatResponse(res, error);
    }
    // if (foundCustomer.isDeleted) {
    //     let error = new Error('This user has been inactivated');
    //     error.name = 'userInactive';
    //     error.ar_message = 'تم تعطيل هذا المستخدم';
    //     return formatResponse(res, error);
    // }
    foundCustomer.device_id = device_id ? device_id : foundCustomer.device_id;
    foundCustomer.device_type = device_type
      ? device_type
      : foundCustomer.device_type;
    await foundCustomer.save();
    foundCustomer = foundCustomer.toObject();
    foundCustomer.token = createToken(foundCustomer);
    formatResponse(res, foundCustomer);
  } else {
    response = {
      status: 'error',
      message: 'Otp not verified',
    };
    formatResponse(res, response);
  }
};

export const mobileSignup = async (req, res) => {
  // const foundCustomer = await Customer.findOne({ email: req.body.email });
  // console.log("foundCustomer---------->", foundCustomer);
  // if (!foundCustomer) {
  //   let error = new Error("Wrong txtId!");
  //   error.name = "DataNotFound";
  //   error.ar_message = "txtId خاطئ!";
  //   return formatResponse(res, error);
  // }

  const customerMailChecker = await Customer.find({
    email: req.body.email,
    active: true,
  });

  const customerMobileChecker = await Customer.find({
    mobile_no: req.body.mobile_no,
    active: true,
  });

  if (customerMailChecker.length >= 1 && customerMailChecker.length >= 1) {
    let error = new Error('Email and Mobile already in use!');
    error.ar_message = 'البريد الاليكتروني قيد الاستخدام!';
    error.name = 'userExist';
    return formatResponse(res, error);
  } else if (customerMailChecker.length >= 1) {
    let error = new Error('Email id already in use!');
    error.ar_message = 'البريد الاليكتروني قيد الاستخدام!';
    error.name = 'userExist';
    return formatResponse(res, error);
  } else if (customerMobileChecker.length >= 1) {
    let error = new Error('Mobile No already in use!');
    error.ar_message = 'البريد الاليكتروني قيد الاستخدام!';
    error.name = 'userExist';
    return formatResponse(res, error);
  }

  const foundRole = await Role.findOne({ name: 'user' });

  // const foundConfiguration = await Configuration.findOne();

  // const creditsFromConfiguration = foundConfiguration.credits;

  req.body.role = foundRole._id;
  req.body.active = true;
  // req.body.credits = creditsFromConfiguration;
  // foundCustomer.set(req.body);
  // let registeredCustomer = await foundCustomer.save();

  const newCustomer = await Customer.create(req.body);
  // registeredCustomer = registeredCustomer.toObject();
  // registeredCustomer.token = createToken(registeredCustomer);
  newCustomer.message = 'Customer registered successfully.';

  const history = new CustomerHistory({
    customer_id: newCustomer._id,
    operation: operationConfig.operations.add,
    // operator: operator,
    operator: 'customer',
    prevObj: null,
    updatedObj: newCustomer,
    operation_date: new Date(),
  });

  await history.save();

  formatResponse(res, newCustomer);
};

export const editCustomer = async (req, res) => {
  const userId = req.user;
  const foundCustomer = await Customer.findById(userId);
  if (!foundCustomer) {
    let error = new Error('User not found!');
    error.name = 'DataNotFound';
    error.ar_message = 'المستخدم ليس موجود!';
    return formatResponse(res, error);
  }
  foundCustomer.set({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    mobile_no: req.body.mobile_no,
    country_code: req.body.country_code,
    preferred_language: req.body.preferred_language,
  });
  let updatedCustomer = await foundCustomer.save();
  updatedCustomer = updatedCustomer.toObject();
  formatResponse(res, updatedCustomer);
};

export const getCustomerById = async (req, res) => {
  const userId = req.user;
  let foundCustomer = await Customer.findById(userId).populate('role');
  if (!foundCustomer) {
    let error = new Error('Customer not found!');
    error.name = 'DataNotFound';
    error.ar_message = 'العميل غير موجود!';
    return formatResponse(res, error);
  }
  foundCustomer = foundCustomer.toObject();
  formatResponse(res, foundCustomer);
};

export const getById = async (req, res) => {
  const id = req.params.id;
  const customer = await Customer.findById(id).populate('role', ['name']);
  if (!customer) {
    let error = new Error('Customer not found!');
    error.name = 'NotFound';
    error.ar_message = 'العميل غير موجود!';
    return formatResponse(res, error);
  }
  formatResponse(res, customer);
};

export const facebookLogin = async (req, res) => {
  try {
    const graphApiUrl = 'https://graph.facebook.com/v7.0/me';
    const params = {
      access_token: req.body.access_token,
      fields: 'id,name,email,picture,first_name,last_name',
    };

    const fbData = await axios.get(graphApiUrl, { params: params });
    const profile = fbData.data;

    const foundConfiguration = await Configuration.findOne();
    const creditsFromConfiguration = foundConfiguration.credits;
    const foundRole = await Role.findOne({ name: 'user' });
    let userEmail = await Customer.findOne({ email: profile.email });

    // #1 User registering through the APP registered email

    if (!userEmail) {
      let customer = new Customer();
      customer.first_name = profile.first_name;
      customer.last_name = profile.last_name;
      customer.facebook_id = profile.id;
      customer.role = foundRole._id;
      customer.email = profile.email;
      customer.active = true;
      customer.source = 'social';
      customer.credits = creditsFromConfiguration;
      customer.profile_pic = `https://graph.facebook.com/${profile.id}/picture?type=large`;
      let savedCustomer = await customer.save();

      savedCustomer = savedCustomer.toObject();
      savedCustomer.token = createToken(savedCustomer);
      savedCustomer.isContactExists = false;
      return formatResponse(res, savedCustomer);
    }
    // // #2 User exists but not any mobile no with that account (merging with FB)
    if (userEmail && !userEmail.mobile_no) {
      userEmail.facebook_id = profile.id;
      userEmail.first_name = userEmail.first_name
        ? userEmail.first_name
        : profile.first_name;
      userEmail.last_name = userEmail.last_name
        ? userEmail.last_name
        : profile.last_name;
      userEmail.role = foundRole._id;
      userEmail.source = 'social';
      userEmail.email = profile.email;
      userEmail.credits = creditsFromConfiguration;
      userEmail.device_type = req.body.device_type;
      userEmail.device_id = req.body.device_id;
      userEmail.profile_pic = `https://graph.facebook.com/${profile.id}/picture?type=large`;
      await userEmail.save();
      userEmail = userEmail.toObject();
      userEmail.token = createToken(userEmail);
      userEmail.isContactExists = false;
      return formatResponse(res, userEmail);
    }
    // // #3  User exists AND mobile no is already associated with that account
    if (userEmail && userEmail.mobile_no) {
      userEmail.facebook_id = profile.id;
      userEmail.source = 'social';
      userEmail.email = profile.email;
      userEmail.device_type = req.body.device_type;
      userEmail.device_id = req.body.device_id;
      userEmail.profile_pic = `https://graph.facebook.com/${profile.id}/picture?type=large`;
      await userEmail.save();
      userEmail = userEmail.toObject();
      userEmail.token = createToken(userEmail);
      userEmail.isContactExists = true;
      return formatResponse(res, userEmail);
    }
  } catch (err) {
    if (err.response && err.response.data) {
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
  const peopleApiUrl = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${req.body.access_token}`;
  await axios
    .get(peopleApiUrl)
    .then(async (googleData) => {
      const profile = googleData.data;
      // Getting the default credits
      const foundConfiguration = await Configuration.findOne();
      const creditsFromConfiguration = foundConfiguration.credits;
      let foundCustomer = await Customer.findOne({ email: profile.email });
      if (!foundCustomer) {
        const foundRole = await Role.findOne({ name: 'user' });
        let customer = new Customer();
        customer.first_name = profile.given_name;
        customer.last_name = profile.family_name;
        customer.google_id = profile.sub;
        customer.email = profile.email;
        customer.profile_pic = profile.picture.replace('sz=50', 'sz=200');
        customer.role = foundRole._id;
        customer.source = 'social';
        customer.active = true;

        customer.credits = creditsFromConfiguration;
        let savedCustomer = await customer.save();
        savedCustomer = savedCustomer.toObject();
        savedCustomer.token = createToken(savedCustomer);
        savedCustomer.isContactExists = false;
        return formatResponse(res, savedCustomer);
      }
      if (foundCustomer && !foundCustomer.mobile_no) {
        foundCustomer = foundCustomer.toObject();
        foundCustomer.token = createToken(foundCustomer);
        foundCustomer.isContactExists = false;
        return formatResponse(res, foundCustomer);
      }
      if (foundCustomer && foundCustomer.mobile_no) {
        foundCustomer = foundCustomer.toObject();
        foundCustomer.token = createToken(foundCustomer);
        foundCustomer.isContactExists = true;
        return formatResponse(res, foundCustomer);
      }
    })
    .catch((err) => {
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
    });
};

export const appleLogin = async (req, res) => {
  try {
    const clientId = 'com.homeservices.consumer';
    const { sub } = await appleSignin.verifyIdToken(req.body.identityToken, {
      audience: clientId,
      ignoreExpiration: true, // ignore token expiry (never expires)
    });

    const foundConfiguration = await Configuration.findOne();
    const creditsFromConfiguration = foundConfiguration.credits;
    let foundCustomer = await Customer.findOne({ apple_id: req.body.user });
    if (!foundCustomer) {
      const foundRole = await Role.findOne({ name: 'user' });
      let customer = new Customer();

      customer.first_name = req.body.givenName ? req.body.givenName : 'null';
      customer.last_name = req.body.familyName ? req.body.familyName : 'null';
      customer.apple_id = req.body.user;
      customer.email = req.body.email;
      customer.role = foundRole._id;
      customer.source = 'social';
      customer.active = true;
      customer.credits = creditsFromConfiguration;
      let savedCustomer = await customer.save();
      savedCustomer = savedCustomer.toObject();
      savedCustomer.token = createToken(savedCustomer);
      savedCustomer.isContactExists = false;
      return formatResponse(res, savedCustomer);
    }
    if (foundCustomer && !foundCustomer.mobile_no) {
      foundCustomer = foundCustomer.toObject();
      foundCustomer.token = createToken(foundCustomer);
      foundCustomer.isContactExists = false;
      return formatResponse(res, foundCustomer);
    }
    if (foundCustomer && foundCustomer.mobile_no) {
      foundCustomer = foundCustomer.toObject();
      foundCustomer.token = createToken(foundCustomer);
      foundCustomer.isContactExists = true;
      return formatResponse(res, foundCustomer);
    }
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

export const appleLoginCheck = async (req, res) => {
  const { user } = req.body;

  const isCustomerExist = await Customer.findOne({
    apple_id: user,
  });
  if (isCustomerExist) {
    return formatResponse(res, 'Customer found');
  } else {
    return formatResponse(res, 'Customer not found');
  }
};
/**
 * @apidescription add customer address
 * @param {*} req
 * @param {*} res
 */
export const addAddress = async (req, res) => {
  const customerId = req.user;
  const foundCustomer = await Customer.findById(customerId);
  if (!foundCustomer) {
    let error = new Error('Customer not found!');
    error.name = 'DataNotFound';
    error.ar_message = 'العميل غير موجود!';
    return formatResponse(res, error);
  }
  req.body.addresses.forEach((address) => {
    foundCustomer.addresses.push(address);
  });

  let updatedCustomer = await foundCustomer.save();
  updatedCustomer = updatedCustomer.toObject();
  formatResponse(res, updatedCustomer);
};

export const updateAddress = async (req, res) => {
  const customerId = req.user;
  const updatedData = await Customer.findOneAndUpdate(
    {
      _id: customerId,
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
  const customerId = req.user;
  const updatedData = await Customer.findOneAndUpdate(
    {
      _id: customerId,
    },
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );
  formatResponse(res, updatedData ? updatedData : {});
};
/**
 * get customer list by admin
 * @param {*} req page and items
 * @param {*} res list of all customer
 */
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
  const count = await Customer.find(searchData).countDocuments();
  const customers = await Customer.find(searchData)
    .sort({ updated_at: 'DESC' })
    .populate('role', ['name'])
    .skip(skip)
    .limit(limit)
    .lean();
  let result = customers;

  const customerIds = customers.map((customer) => customer._id);
  const cancelServiceQuery = [
    { $project: { progress: 1, customer_id: 1 } },
    { $match: { progress: 'cancel', customer_id: { $in: customerIds } } },
    { $group: { _id: '$customer_id', count: { $sum: 1 } } },
  ];
  const completedServiceQuery = [
    { $project: { progress: 1, customer_id: 1 } },
    { $match: { progress: 'accepted', customer_id: { $in: customerIds } } },
    { $group: { _id: '$customer_id', count: { $sum: 1 } } },
  ];
  const serviceCancelPromise = Service.aggregate(cancelServiceQuery);
  const serviceCompletedPromise = ServiceActivity.aggregate(
    completedServiceQuery
  );
  const usersRatingPromise = Review.aggregate([
    { $group: { _id: '$user_id', rating: { $avg: '$user_rating' } } },
  ]);

  const [
    serviceCancelCount,
    serviceCompletedCount,
    usersRating,
  ] = await Promise.all([
    serviceCancelPromise,
    serviceCompletedPromise,
    usersRatingPromise,
  ]);

  result.forEach((cust) => {
    cust.userId = cust._id;
    cust.service_completed = 0;
    cust.service_cancelled = 0;
    cust.user_rating = 0;
    serviceCompletedCount.forEach((completed) => {
      if (cust._id === completed._id) {
        cust.service_completed = completed.count;
      }
    });
    serviceCancelCount.forEach((cancel) => {
      if (cust._id === cancel._id) {
        cust.service_cancelled = cancel.count;
      }
    });
    usersRating.forEach((userRating) => {
      if (cust._id === userRating._id) {
        cust.user_rating = userRating.rating ? userRating.rating : 0;
      }
    });
  });

  const data = {
    total: count,
    pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
    result: result,
  };

  formatResponse(res, data);
};

export const create = async (req, res) => {
  const operator = req.user;
  const email = req.body.email.toLowerCase();
  const mobile = req.body.mobile_no;

  let foundCustomer = await Customer.findOne({
    $or: [{ email: email }, { mobile_no: mobile }],
  });
  const foundRole = await Role.findOne({ name: 'user' });
  if (!foundRole) {
    let error = new Error('Role not found!');
    error.name = 'NotFound';
    error.ar_message = 'الدور غير موجود!';
    return formatResponse(res, error);
  }
  if (foundCustomer) {
    req.body.isDeleted = false;
    req.body.role = foundRole._id;
    foundCustomer.set(req.body);
    let registeredUser = await foundCustomer.save();
    return formatResponse(res, registeredUser);
  }

  req.body.role = foundRole._id;
  const newCustomer = await Customer.create(req.body);

  const history = new CustomerHistory({
    customer_id: newCustomer._id,
    operation: operationConfig.operations.add,
    operator: operator,
    prevObj: null,
    updatedObj: newCustomer,
    operation_date: new Date(),
  });

  await history.save();
  formatResponse(res, newCustomer);
};

export const add = async (req, res) => {
  const operator = req.user;
  const email = req.body.email.toLowerCase();
  const mobile = req.body.mobile_no;

  let foundCustomer = await Customer.findOne({
    $or: [{ email: email }, { mobile_no: mobile }],
  });
  const foundRole = await Role.findOne({ name: 'user' });
  if (!foundRole) {
    let error = new Error('Role not found!');
    error.name = 'NotFound';
    error.ar_message = 'الدور غير موجود!';
    return formatResponse(res, error);
  }
  if (foundCustomer) {
    req.body.isDeleted = false;
    req.body.role = foundRole._id;
    foundCustomer.set(req.body);
    let registeredUser = await foundCustomer.save();
    return formatResponse(res, registeredUser);
  }

  req.body.role = foundRole._id;
  const newCustomer = await Customer.create(req.body);

  const history = new CustomerHistory({
    customer_id: newCustomer._id,
    operation: operationConfig.operations.add,
    operator: operator,
    prevObj: null,
    updatedObj: newCustomer,
    operation_date: new Date(),
  });

  await history.save();
  formatResponse(res, newCustomer);
};

export const updateUser = async (req, res) => {
  const operator = req.user;
  const id = req.params.id;

  let foundCustomer = await Customer.findById(id);

  if (!foundCustomer) {
    let error = new Error('Customer not be registered!');
    error.name = 'userExist';
    error.ar_message = 'الزبون غير مسجل!';
    return formatResponse(res, error);
  }

  const origObj = foundCustomer.toObject();
  req.body.email = req.body.email.toLowerCase();

  delete req.body.role;
  foundCustomer.set(req.body);
  const updatedCustomer = await foundCustomer.save();

  const history = new CustomerHistory({
    customer_id: foundCustomer._id,
    operation: operationConfig.operations.update,
    operator: operator,
    prevObj: origObj,
    updatedObj: updatedCustomer,
    operation_date: new Date(),
  });

  await history.save();
  formatResponse(res, updatedCustomer);
};

export const remove = async (req, res) => {
  const id = req.params.id;
  const foundCustomer = await Customer.findById(id);
  if (!foundCustomer) {
    let error = new Error('Customer not found!');
    error.name = 'NotFound';
    error.ar_message = 'العميل غير موجود!';
    return formatResponse(res, error);
  }

  foundCustomer.isDeleted = true;
  foundCustomer.active = false;
  foundCustomer.old_mobile_no = foundCustomer.mobile_no;
  foundCustomer.mobile_no = '';
  await foundCustomer
    .save()
    .then(async () => {
      await CustomerHistory.remove({ customer_id: foundCustomer._id });
      formatResponse(res, foundCustomer);
    })
    .catch((err) => {
      console.log('error--------->', err);
    });
};

export const removeAll = async (req, res) => {
  const customerIds = req.body.ids;
  const customers = await Customer.find({ _id: { $in: customerIds } });
  if (!customers.length) {
    let error = new Error('Customer not found!');
    error.name = 'NotFound';
    error.ar_message = 'العميل غير موجود!';
    return formatResponse(res, error);
  }
  await Customer.update(
    { _id: { $in: customerIds } },
    { isDeleted: true, active: false, mobile_no: '' },
    { multi: true }
  );
  await CustomerHistory.remove({ _id: { $in: customerIds } });
  return formatResponse(res, customers);
};

export const history = async (req, res) => {
  const items = req.query.items ? req.query.items : 10;
  const page = req.query.page ? page : 1;
  const skip = items * (page - 1);
  const limit = parseInt(items);

  const searchData = req.params.id ? { customer_id: req.params.id } : {};

  const count = await CustomerHistory.find(searchData).countDocuments();
  const customerHistory = await CustomerHistory.find(searchData)
    .sort({ operation_date: 'desc' })
    .populate('operator', ['first_name', 'last_name', 'email'])
    .populate('updatedObj.role', ['name'])
    .populate('prevObj.role', ['name'])
    .skip(skip)
    .limit(limit);

  const data = {
    total: count,
    pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
    result: customerHistory,
  };
  formatResponse(res, data);
};

/**
 * API to ask for the phone_number after the Social Signup
 */
export const addContactForSocialSignup = async (req, res) => {
  try {
    const userId = req.user;
    const user = await Customer.findById(userId);
    if (user && user.mobile_no) {
      let error = new Error('Contact Already Exists');
      error.name = 'dataExist';
      error.ar_message = 'الاتصال موجود بالفعل';
      return formatResponse(res, error);
    }
    const mobile_no = req.body.mobile_no;
    const country_code = req.body.country_code;
    const userCheck = await Customer.findOne({
      mobile_no: mobile_no,
      isDeleted: false,
      active: true,
    });
    if (userCheck) {
      let error = new Error(
        'Entered mobile number already exists, please enter different number'
      );
      error.name = 'dataExist';
      error.ar_message =
        'رقم الجوال المدخل موجود بالفعل ، يرجى إدخال رقم مختلف';
      return formatResponse(res, error);
    }
    const otp = otpService.generateOtp();

    const params = {
      Message: `Your HSA OTP for mobile verification is ${otp}, HSA team`,
      PhoneNumber: `${country_code}${mobile_no}`,
    };
    if (user && user.email) {
      mail.send({
        user: user,
        subject: 'One Time Password for HSA',
        filename: 'otp',
        otp,
      });
    }
    await snsSendSMS(params);

    formatResponse(res, {
      message: 'OTP sent on your mobile number444',
      otp: otp,
      ar_message: 'أرسلت OTP على رقم هاتفك المحمول',
    });
  } catch (err) {
    console.log('err1========', err);

    if (err.response) {
      logger.error(err.response.data);
      const formatError = err.response.data.error
        ? err.response.data.error.message
        : 'Unautherised Access';
      const error = new Error(formatError);
      error.name = 'OAuthException';
      return formatResponse(res, error);
    }
    logger.error(err);
    return res.status(500).send({ err: {} });
  }
};

/**
 * Verify the mobile number via OTP (For the first Social LoggedIn users)
 * @param {'*'} req
 * @param {*} res
 */
export const socialVerifyContactNumber = async (req, res) => {
  const country_code = req.body.country_code;
  const mobile_no = req.body.mobile_no;
  const otp = req.body.otp;
  const email = req.body.email;
  let response = {};
  // const otpVerified = otpService.verifyOtp(otp);
  const otpVerified = true;
  if (otpVerified) {
    const foundCustomer = await Customer.findOne({ email: email });

    console.log('foundCustomer===');
    console.log(foundCustomer);
    console.log('foundCustomer===');

    if (foundCustomer) {
      let existingData = {
        country_code: country_code,
        device_id: req.body.device_id,
        device_type: req.body.device_type,
        mobile_no: mobile_no,
        active: true,
        email: foundCustomer.email ? foundCustomer.email : email,
        isDeleted: false,
      };
      foundCustomer.set(existingData);
      let registeredCustomer = await foundCustomer.save();
      registeredCustomer = registeredCustomer.toObject();
      registeredCustomer.token = createToken(foundCustomer);
      registeredCustomer.message = 'Otp verified';
      return formatResponse(res, registeredCustomer);
    } else {
      let error = new Error('Customer not found!');
      error.name = 'NotFound';
      error.ar_message = 'العميل غير موجود!';
      return formatResponse(res, error);
    }
  } else {
    response = {
      status: 'error',
      message: 'Entered OTP is not correct. Please enter the Correct OTP',
      ar_message: 'تم إدخال OTP غير صحيح. يرجى إدخال OTP الصحيح',
    };
    formatResponse(res, response);
  }
};

/**
 * ONLY Registration Phase - checking for the existing contact no.
 */
export const contactCheck = async (req, res) => {
  const mobile = req.body.mobile;
  if (!mobile) {
    let error = new Error('Please provide the mobile number!');
    error.name = 'DataNotFound';
    error.ar_message = 'يرجى تقديم رقم الجوال!';
    return formatResponse(res, error);
  }
  const user = await Customer.findOne({ mobile_no: mobile, isDeleted: false });
  if (user) {
    let error = new Error(
      'Entered mobile number already exists, please enter different number'
    );
    error.ar_message = 'رقم الجوال المدخل موجود بالفعل ، يرجى إدخال رقم مختلف';
    error.name = 'userExist';
    return formatResponse(res, error);
  }
  return formatResponse(res, {
    success: 'Valid mobile number',
    ar_message: 'رقم الجوال صالح',
  });
};

export const checkuser = async (req, res) => {
  const mobile = req.body.mobile;
  if (!mobile) {
    let error = new Error('Please provide the mobile number!');
    error.name = 'DataNotFound';
    error.ar_message = 'يرجى تقديم رقم الجوال!';
    return formatResponse(res, error);
  }
  const user = await Provider.findOne({
    mobile_no: mobile,
    isDeleted: false,
  });
  if (user) {
    let error = new Error(
      'Entered mobile number already exists, please enter different number'
    );
    error.ar_message = 'رقم الجوال المدخل موجود بالفعل ، يرجى إدخال رقم مختلف';
    error.name = 'userExist';
    return formatResponse(res, error);
  }
  return formatResponse(res, {
    success: 'Valid mobile number',
    ar_message: 'رقم الجوال صالح',
  });
};

export const reauthenticateOTP = async (req, res) => {
  const userId = req.user;

  const mobile_no = req.body.mobile_no;
  const country_code = req.body.country_code;
  const user = await Customer.findById(userId);
  if (!user) {
    let error = new Error('Customer not registered!');
    error.ar_message = 'العميل غير مسجل!';
    error.name = 'DataNotFound';
    return formatResponse(res, error);
  }
  const otp = otpService.generateOtp();

  const params = {
    Message: `Your HSA One Time Password is ${otp}, HSA team`,
    PhoneNumber: `${country_code}${mobile_no}`,
  };

  if (user && user.email) {
    mail.send({
      user: user,
      subject: 'One Time Password for HSA',
      filename: 'otp',
      otp,
    });
  }
  await snsSendSMS(params);
  //console.log("3"+user);
  formatResponse(res, {
    message: 'OTP sent on your mobile number555',
    otp: otp,
    ar_message: 'أرسلت OTP على رقم هاتفك المحمول',
  });
};

/**
 * Getting the Latest device token with the background API calls
 */
export const getLatestDeviceId = async (req, res) => {
  try {
    const userId = req.user;
    const user_role = req.params.role;
    const device_id = req.body.device_id;
    if (user_role === constants.CUSTOMER) {
      await Customer.findByIdAndUpdate(userId, {
        $set: { device_id: device_id },
      })
        .then((success) => formatResponse(res, {}))
        .catch((err) => formatResponse(res, err));
    }
    if (user_role === constants.PROVIDER) {
      await Provider.findByIdAndUpdate(userId, {
        $set: { device_id: device_id },
      })
        .then((success) => formatResponse(res, {}))
        .catch((err) => formatResponse(res, err));
    }
  } catch (err) {
    console.log(err);
  }
};

export const reVerifyingOtp = async (req, res) => {
  const userId = req.user;
  const country_code = req.body.country_code;
  const mobile_no = req.body.mobile_no;
  const otp = req.body.otp;
  let response = {};
  const otpVerified = otpService.verifyOtp(otp);
  if (otpVerified) {
    const foundCustomer = await Customer.findById(userId);
    if (foundCustomer) {
      foundCustomer.mobile_no = mobile_no;
      foundCustomer.country_code = country_code;
      let registeredCustomer = await foundCustomer.save();
      registeredCustomer.message = 'Otp verified';
      return formatResponse(res, registeredCustomer);
    } else {
      let error = new Error('Customer not registered!');
      error.ar_message = 'العميل غير مسجل!';
      error.name = 'DataNotFound';
      return formatResponse(res, error);
    }
  } else {
    response = {
      status: 'error',
      message: 'Entered OTP is not correct. Please enter the Correct OTP',
      ar_message: 'تم إدخال OTP غير صحيح. يرجى إدخال OTP الصحيح',
    };
    return formatResponse(res, response);
  }
};

export const tester = async (req, res) => {
  const admin = require('firebase-admin');
  const CONSUMER_CERT = require('../../config/homeservices-firebase.json');
  // const consumer = admin.initializeApp({
  // credential: admin.credential.cert(CONSUMER_CERT),
  // name: 'tester'
  // });

  var payload = {
    notification: {
      title: 'Account Deposit',
      body: 'A deposit to your savings account has just cleared.',
    },
    data: {
      account: 'Savings',
      balance: '$3020.25',
    },
  };
  var options = {
    priority: 'normal',
    timeToLive: 60 * 60,
  };
  admin
    .messaging()
    .sendToDevice(
      'c1lYaDHMZ7M:APA91bFru-VMczzZppDnww2CW7T_hEJyweVuICb5mDGsp5kp2BxzYOnS4OyW3dmDDp68wnLvWylEWZueuBvZEmlKaVYMmkVVs3HPLSHtfcZmNdMrUqKKOran5jY7yInhZgexIGxodeOa',
      payload,
      options
    )
    .then(function(response) {
      console.log('Successfully sent message:', response);
    })
    .catch(function(error) {
      console.log('Error sending message:', error);
    });
  console.log(admin);
  formatResponse(res, {});
};
