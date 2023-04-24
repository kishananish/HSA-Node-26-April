'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _userCtrl = require('../controller/userCtrl');

var userCtrl = _interopRequireWildcard(_userCtrl);

var _validation = require('../middlewares/validation');

var _validation2 = _interopRequireDefault(_validation);

var _user = require('../validation/user');

var _user2 = _interopRequireDefault(_user);

var _errorHandler = require('../handler/errorHandler');

var _auth = require('../middlewares/auth');

var auth = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router({ caseSensitive: true });

router.post('/signup', (0, _validation2.default)(_user2.default.mobileSignup), (0, _errorHandler.catchErrors)(userCtrl.mobileSignup));
router.post('/signin', (0, _errorHandler.catchErrors)(userCtrl.mobileSignin));
router.post('/facebook', (0, _validation2.default)(_user2.default.facebookLogin), userCtrl.facebookLogin);
router.post('/google', (0, _validation2.default)(_user2.default.googleLogin), userCtrl.googleLogin);
router.post('/apple', (0, _validation2.default)(_user2.default.appleLogin), userCtrl.appleLogin);
router.post('/send-otp', (0, _validation2.default)(_user2.default.sendOtp), (0, _errorHandler.catchErrors)(userCtrl.sendOtp));
router.post('/verify-otp', (0, _validation2.default)(_user2.default.verifyOtp), (0, _errorHandler.catchErrors)(userCtrl.verifyOtp));
router.post('/generate-otp', (0, _validation2.default)(_user2.default.sendOtp), (0, _errorHandler.catchErrors)(userCtrl.generateOtp));

router.get('/', auth.ensureServiceProviderAuth, (0, _errorHandler.catchErrors)(userCtrl.getUser));
router.get('/all', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(userCtrl.getCustomerList));
router.put('/', auth.ensureServiceProviderAuth, (0, _validation2.default)(_user2.default.editUser), (0, _errorHandler.catchErrors)(userCtrl.editUser));
router.delete('/', auth.ensureServiceProviderAuth, (0, _errorHandler.catchErrors)(userCtrl.deleteUser));

router.post('/address', auth.ensureServiceProviderAuth, (0, _validation2.default)(_user2.default.addAddress), (0, _errorHandler.catchErrors)(userCtrl.addAddress));
router.put('/address/:addressId', auth.ensureServiceProviderAuth, (0, _errorHandler.catchErrors)(userCtrl.updateAddress));
router.delete('/address/:addressId', auth.ensureServiceProviderAuth, (0, _errorHandler.catchErrors)(userCtrl.deleteAddress));

exports.default = router;