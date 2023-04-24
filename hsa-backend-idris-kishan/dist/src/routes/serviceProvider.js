'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _serviceProviderCtrl = require('../controller/serviceProviderCtrl');

var providerCtrl = _interopRequireWildcard(_serviceProviderCtrl);

var _validation = require('../middlewares/validation');

var _validation2 = _interopRequireDefault(_validation);

var _provider = require('../validation/provider');

var _provider2 = _interopRequireDefault(_provider);

var _errorHandler = require('../handler/errorHandler');

var _auth = require('../middlewares/auth');

var auth = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router({ caseSensitive: true });

router.post('/send-otp', (0, _errorHandler.catchErrors)(providerCtrl.sendOtp));
router.post('/signin', (0, _errorHandler.catchErrors)(providerCtrl.mobileSignin));
router.post('/resend-otp', (0, _validation2.default)(_provider2.default.sendOtp), (0, _errorHandler.catchErrors)(providerCtrl.resendOtp));

router.get('/', auth.ensureServiceProviderAuth, (0, _errorHandler.catchErrors)(providerCtrl.getUser));
router.put('/', auth.ensureServiceProviderAuth, (0, _validation2.default)(_provider2.default.editUser), (0, _errorHandler.catchErrors)(providerCtrl.editUser));

router.post('/address', auth.ensureServiceProviderAuth,
//validate(providerValidator.addAddress),
(0, _errorHandler.catchErrors)(providerCtrl.addAddress));
router.put('/address/:addressId', auth.ensureServiceProviderAuth, (0, _errorHandler.catchErrors)(providerCtrl.updateAddress));
router.delete('/address/:addressId', auth.ensureServiceProviderAuth, (0, _errorHandler.catchErrors)(providerCtrl.deleteAddress));

exports.default = router;