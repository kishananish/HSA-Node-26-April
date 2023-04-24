import { verify } from 'jsonwebtoken';
import config from '../../config/config';
import logger from '../../utils/logger';
import User from '../models/User';
import Customer from '../models/Customer';

export const ensureAuth = async (req, res, next) => {
  const token = req.headers.access_token;
  if (!token) {
    return res
      .status(401)
      .send({ success: false, msg: 'Auth headers required', data: {} });
  }
  try {
    const decoded = await verify(token, config.JWT_SECRET);
    const customer = await Customer.findById(decoded.sub);
    if (!customer) {
      const user = await User.findById(decoded.sub);
      if (!user) {
        return res
          .status(401)
          .send({ success: false, msg: 'Unauthorized user', data: {} });
      } else {
        req.user = decoded.sub;
        next();
      }
    } else {
      req.user = decoded.sub;
      next();
    }
  } catch (err) {
    logger.error(err.stack);
    if (err.name === 'TokenExpiredError') {
      return res
        .status(401)
        .send({ success: false, msg: 'Auth token expired', data: err });
    }
    if (err.name === 'JsonWebTokenError') {
      return res
        .status(401)
        .send({ success: false, msg: 'Invalid token', data: err });
    }
    return res
      .status(401)
      .send({ success: false, msg: err.message, data: err });
  }
};

export const ensureServiceProviderAuth = async (req, res, next) => {
  const token = req.headers.access_token;
  if (!token) {
    return res
      .status(401)
      .send({ success: false, msg: 'Auth headers required', data: {} });
  }
  try {
    const decoded = await verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.sub).populate('role', ['name']);

    if (!user) {
      return res
        .status(401)
        .send({ success: false, msg: 'Permission Denied', data: {} });
    }
    const roles = user.role.map((role) => role.name);
    if (!(roles.indexOf('service_provider') > -1)) {
      return res
        .status(401)
        .send({ success: false, msg: 'Permission Denied', data: {} });
    }
    req.user = decoded.sub;
    next();
  } catch (err) {
    logger.error(err.stack);
    if (err.name === 'TokenExpiredError') {
      return res
        .status(401)
        .send({ success: false, msg: 'Auth token expired', data: err });
    }
    if (err.name === 'JsonWebTokenError') {
      return res
        .status(401)
        .send({ success: false, msg: 'Invalid token', data: err });
    }
    return res
      .status(401)
      .send({ success: false, msg: err.message, data: err });
  }
};

export const ensureAdminAuth = async (req, res, next) => {
  const token = req.headers.access_token;

  if (!token) {
    return res
      .status(401)
      .send({ success: false, msg: 'Auth headers required', data: {} });
  }

  try {
    const decoded = await verify(token, config.JWT_SECRET);

    const user = await User.findById(decoded.sub).populate('role');

    if (!user) {
      return res
        .status(401)
        .send({ success: false, msg: 'Permission Denied', data: {} });
    }
    let isPermission = false;
    user.role.map((role) => {
      if (
        role.name !== config.authTypes.USER &&
        role.name !== config.authTypes.SERVICE_PROVIDER
      ) {
        isPermission = true;
      }
    });
    if (!isPermission) {
      return res
        .status(401)
        .send({ success: false, msg: 'Permission Denied', data: {} });
    }
    req.user = decoded.sub;
    next();
  } catch (err) {
    logger.error(err.stack);
    if (err.name === 'TokenExpiredError') {
      return res
        .status(401)
        .send({ success: false, msg: 'Auth token expired', data: {} });
    }
    if (err.name === 'JsonWebTokenError') {
      return res
        .status(401)
        .send({ success: false, msg: 'Invalid token', data: {} });
    }
    return res
      .status(401)
      .send({ success: false, msg: err.message, data: err });
  }
};
