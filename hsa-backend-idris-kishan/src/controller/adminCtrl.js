import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import User from '../models/User';
import config from '../../config/config';
import formatResponse from '../../utils/formatResponse';
import * as mail from '../handler/mail';
import Role from '../models/Role';
import Customer from '../models/Customer';
import logger from '../../utils/logger';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

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

export const signin = async (req, res) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  console.log('foundUser :', req.body);
  let foundUser = await User.findOne({ email: email }, '+password').populate(
    'role'
  );

  console.log('>>>>>>>>>>>>>>>>>', foundUser);
  if (!foundUser) {
    let error = new Error(' 1111 Wrong username or password!');
    error.name = 'AuthenticationError';
    return formatResponse(res, error);
  }
  let isPermission = false;
  foundUser.role.map((role) => {
    if (
      role.name !== config.authTypes.USER ||
      role.name !== config.authTypes.SERVICE_PROVIDER
    ) {
      isPermission = true;
    }
  });
  if (!isPermission) {
    let error = new Error('22222 Wrong username or password');
    error.name = 'AuthenticationError';
    return formatResponse(res, error);
  }

  const isMatch = await foundUser.comparePassword(password);

  console.log(isMatch);

  if (!isMatch) {
    let error = new Error('333 Wrong username or password!!!!!!');
    error.name = 'AuthenticationError';
    return formatResponse(res, error);
  } else {
    foundUser = foundUser.toObject();
    foundUser.role.forEach((role) => {
      role.access_level.forEach((access) => {
        if (access.name === 'Manage Customers') {
          access.link = '/customer-manage';
          access.sequence = 1;
        }
        if (access.name === 'Manage Users') {
          access.link = '/service-provider-manage';
          access.sequence = 2;
        }
        if (access.name === 'Manage Service Request') {
          access.link = '/service-request-manage';
          access.sequence = 3;
        }
        if (access.name === 'Manage Category') {
          access.link = '/category-manage';
          access.sequence = 4;
        }
        if (access.name === 'Manage Sub-Category') {
          access.link = '/sub-category-manage';
          access.sequence = 5;
        }
        if (access.name === 'Manage Material') {
          access.link = '/material-manage';
          access.sequence = 6;
        }
        if (access.name === 'Manage FAQ') {
          access.link = '/faq-manage';
          access.sequence = 7;
        }
        if (access.name === 'Manage Promo Code') {
          access.link = '/promo-code-manage';
          access.sequence = 8;
        }
        if (access.name === 'Manage Query / Suggestion') {
          access.link = '/query-manage';
          access.sequence = 9;
        }
        if (access.name === 'Notifications') {
          access.link = '/notifications';
          access.sequence = 10;
        }
        if (access.name === 'Manage Roles') {
          access.link = '/role-manage';
          access.sequence = 11;
        }
        if (access.name === 'Manage Configuration') {
          logger.info({ mess: 'done wjere' });
          access.link = '/configuration-manage';
          access.sequence = 12;
        }
        if (access.name === 'Reports') {
          access.link = '';
          access.sequence = 13;
        }
      });
    });
    foundUser.token = createToken(foundUser);
    formatResponse(res, foundUser);
  }
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

export const forgotPassword = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    let error = new Error('Wrong email!');
    error.name = 'DataNotFound';
    return formatResponse(res, error);
  }
  // Set reset tokens and expiry on their account
  user.resetPasswordToken = randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
  await user.save();
  // Send them an email with the token
  const resetURL = `http://${req.headers.host}/api/admin/reset/${user.resetPasswordToken}`;

  await mail.send({
    user,
    subject: 'Password Reset',
    filename: 'password-reset',
    resetURL,
  });
  let response = {
    message: 'You have been emailed a password reset link.',
    resetURL: resetURL,
    // resetToken: user.resetPasswordToken
  };

  //TODO: remove resetToken from response and send it to an email
  return formatResponse(res, response);
};

export const resetPassword = async (req, res) => {
  const resetPasswordToken = req.params.token;
  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
  let showForm = false;
  let title = 'Password Reset Link Expired';
  if (user) {
    showForm = true;
    title = 'Reset your Password 33333333333333';
  }
  res.render('reset', { title, showForm, resetPasswordToken });
};

export const payment = async (req, res) => {
  var shaString = '';

  const arrData = {
    access_code: 'C9znXzHGbZ8mKhP8aZqx',
    amount: '20',
    command: 'AUTHORIZATION',
    currency: 'SAR',
    customer_email: 'test@payfort.com',
    language: 'en',
    merchant_identifier: 'KtIggBZD',
    merchant_reference: 'Code-order-0319',
    order_description: 'iPhone 6-S',
  };

  for (const key in arrData) {
    console.log(`${key}: ${arrData[key]}`);
    shaString += `${key}=${arrData[key]}`;
  }

  console.log(shaString);

  const input = '2020@Sharif' + shaString + '2020@Sharif';

  // Create hash object
  const hash = crypto.createHash('sha256');

  // Update hash with input value
  hash.update(input);

  // Get hashed output as hex string
  const output = hash.digest('hex');

  console.log(output);

  arrData.signature = output;

  console.log(arrData);

  const resetPasswordToken = req.params.token;
  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  let showForm = true;
  let title = 'Payment page';
  //   let showForm = false;
  //   let title = "Password Reset Link Expired";
  //   if (user) {
  //     showForm = true;
  //     title = "Reset your Password";
  //   }
  res.render('payment', { title, showForm, resetPasswordToken, arrData });
};

export const updatePassword = async (req, res) => {
  const resetPasswordToken = req.params.token;
  const redirectUrl = `http://${req.headers.host}/api/admin/reset/${resetPasswordToken}`;
  let showForm = true;
  let title = 'Password Updated Successfully';
  if (req.body.password !== req.body['password-confirm']) {
    showForm = false;
    title = 'Password and confirm password are not same!';
    return res.redirect(redirectUrl);
  }
  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    showForm = false;
    title = 'Password reset is invalid or has expired!';
    return res.redirect(redirectUrl);
  }

  user.set({
    password: req.body.password,
    resetPasswordToken: undefined,
    resetPasswordExpires: undefined,
  });
  await user.save();
  res.render('update', { title, showForm });
};

export const changePassword = async (req, res) => {
  const userId = req.user;
  const new_password = req.body.new_password;
  const old_password = req.body.old_password;
  let foundUser = await User.findOne({ _id: userId }, '+password');

  if (!foundUser) {
    let error = new Error('Wrong password!');
    error.name = 'AuthenticationError';
    return formatResponse(res, error);
  }
  const isMatch = await foundUser.comparePassword(old_password);
  if (!isMatch) {
    let error = new Error('Wrong password!');
    error.name = 'AuthenticationError';
    return formatResponse(res, error);
  } else {
    foundUser.set({
      password: new_password,
    });
    await foundUser.save();
    return formatResponse(res, {});
  }
};

export const searchUsers = async (req, res) => {
  const role = req.query.role;
  const userName = req.query.name;
  const roleSearch =
    role && role === 'all'
      ? { isDeleted: false, name: { $ne: 'admin' } }
      : {
          isDeleted: false,
          $and: [{ name: role }, { name: { $ne: 'admin' } }],
        };
  const foundRoles = await Role.find(roleSearch);
  const roleIds = foundRoles.map((role) => role.id);

  let searchData;
  let collection;
  if (role === 'user') {
    searchData = userName
      ? {
          $or: [
            { first_name: { $regex: userName, $options: 'i' } },
            { last_name: { $regex: userName, $options: 'i' } },
          ],
          isDeleted: false,
          role: { $in: roleIds },
        }
      : { isDeleted: false, role: { $in: roleIds } };
    collection = Customer.find(searchData);
  } else {
    searchData = userName
      ? {
          $or: [
            { first_name: { $regex: userName, $options: 'i' } },
            { last_name: { $regex: userName, $options: 'i' } },
          ],
          isDeleted: false,
          role: { $in: roleIds },
        }
      : { isDeleted: false, role: { $in: roleIds } };
    collection = User.find(searchData);
  }
  const users = await collection.populate('role', ['name']).lean();
  formatResponse(res, users);
};

export const add = async (req, res) => {
  //const resetPasswordToken = req.params.token;
  res.json('hi');
};
