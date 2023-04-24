'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (res, data) {
  var formattedResponse = { status: 'success', message: '', data: '' };
  var statusCode = 200;

  if (data instanceof Error) {
    _logger2.default.debug(data.stack);
    formattedResponse.status = 'error';
    formattedResponse.message = data.message;
    formattedResponse.ar_message = data.ar_message;
    formattedResponse.errorType = '';
    delete data.message;
    delete data.ar_message;

    switch (data.name) {
      case 'dataExist':
        formattedResponse.errorType = 'data_exist';
        formattedResponse.data = {};
        formattedResponse.statusCode = 409;
        statusCode = 409;
        break;
      case 'userExist':
        formattedResponse.errorType = 'user_exist';
        formattedResponse.data = {};
        formattedResponse.statusCode = 409;
        break;
      case 'OAuthException':
        formattedResponse.errorType = 'OAuth_Exception';
        formattedResponse.data = {};
        formattedResponse.statusCode = 401;
        break;

      case 'userInactive':
        formattedResponse.errorType = 'user_inactive';
        formattedResponse.data = {};
        formattedResponse.statusCode = 403;
        break;
      case 'ValidationError':
        formattedResponse.errorType = 'validation_error';
        formattedResponse.data = data.errors || data;
        formattedResponse.statusCode = 400;
        statusCode = 400;
        break;

      case 'AuthenticationError':
        formattedResponse.errorType = 'authentication_error';
        formattedResponse.data = {};
        formattedResponse.statusCode = 401;
        break;

      case 'JsonWebTokenError':
        formattedResponse.errorType = 'json_web_token_error';
        formattedResponse.data = {};
        formattedResponse.statusCode = 401;
        break;

      case 'TokenExpiredError':
        formattedResponse.errorType = 'json_web_token_expired';
        formattedResponse.data = {};
        formattedResponse.statusCode = 401;
        break;

      case 'limit_exceeded':
        formattedResponse.errorType = 'limit_exceeded';
        formattedResponse.data = {};
        formattedResponse.statusCode = 403;
        break;

      case 'DataNotFound':
        formattedResponse.errorType = 'data_not_found';
        formattedResponse.data = {};
        formattedResponse.statusCode = 404;
        break;

      case 'NotFound':
        formattedResponse.errorType = 'resource_unavailable';
        formattedResponse.data = {};
        formattedResponse.statusCode = 404;
        break;

      case 'CantProceed':
        formattedResponse.errorType = 'permission_exceeded';
        formattedResponse.data = {};
        formattedResponse.statusCode = 411;
        break;

      case 'CantOperate':
        formattedResponse.errorType = 'invalid_operation';
        formattedResponse.data = {};
        formattedResponse.statusCode = 414;
        break;

      default:
        formattedResponse.errorType = 'system_error';
        formattedResponse.data = _app2.default.get('env') === 'production' ? {} : data.stack;
        statusCode = 500;
    }

    return res.status(statusCode).send(formattedResponse);
  } else {
    console.log('>>>>>>>>>>>data', data);

    formattedResponse.status = data.status || 'success';
    formattedResponse.data = data;
    formattedResponse.message = data.message || '';
    formattedResponse.ar_message = data.ar_message || '';

    if (data.message) delete data.message;
    delete data.ar_message;

    return res.status(statusCode).send(formattedResponse);
  }
};