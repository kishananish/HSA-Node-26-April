'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var crypto = require('crypto');


var createHash = function createHash(string) {
  var hash = crypto.createHash('sha256').update(string, 'utf8').digest('hex');
  return hash;
};

var create_signature = function create_signature(passphrase, object) {
  var signatureText = '';
  var keys = [];
  for (var eachKey in object) {
    keys.push(eachKey);
  }
  keys.sort(compare);

  var len = keys.length;

  for (var i = 0; i < len; i++) {
    var k = keys[i];
    signatureText = signatureText + (k + '=' + object[k]);
  }
  var digest = passphrase + signatureText + passphrase;
  // console.log("digest",digest);
  var signature = createHash(digest);

  return signature;
};

function compare(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * create token from payfort
 * @param {*} object 
 */

var create_token = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(requestParams) {
    var cardData, options, res;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            cardData = requestParams;
            options = {
              url: 'https://sbcheckout.PayFort.com/FortAPI/paymentPage',
              method: 'POST',
              form: cardData

            };
            _context.next = 4;
            return doRequest(options);

          case 4:
            res = _context.sent;
            return _context.abrupt('return', res);

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function create_token(_x) {
    return _ref.apply(this, arguments);
  };
}();

// send request to payfort 
function doRequest(url) {
  return new _promise2.default(function (resolve, reject) {
    (0, _request2.default)(url, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        var result = body.match(/\{.+\}/);
        var responseBody = result[0];
        var payfortResponse = JSON.parse(responseBody);
        resolve(payfortResponse);
      } else {
        reject(error);
      }
    });
  });
}

/**
 * send request to payfort for getting 3d url
 * @param {*} requestParams 
 */
var create_payfort_url = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(requestParams) {
    var cardData, options, res;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            cardData = requestParams;
            options = {
              url: 'https://sbpaymentservices.payfort.com/FortAPI/paymentApi',
              method: 'POST',
              json: cardData
            };
            _context2.next = 4;
            return getPayfort3dUrl(options);

          case 4:
            res = _context2.sent;
            return _context2.abrupt('return', res);

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function create_payfort_url(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

function getPayfort3dUrl(url) {
  return new _promise2.default(function (resolve, reject) {
    (0, _request2.default)(url, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

exports.create_signature = create_signature;
exports.create_token = create_token;
exports.create_payfort_url = create_payfort_url;