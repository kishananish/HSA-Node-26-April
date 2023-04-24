'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _customerCtrl = require('../controller/customerCtrl');

var customerCtrl = _interopRequireWildcard(_customerCtrl);

var _validation = require('../middlewares/validation');

var _validation2 = _interopRequireDefault(_validation);

var _customer = require('../validation/customer');

var _customer2 = _interopRequireDefault(_customer);

var _errorHandler = require('../handler/errorHandler');

var _auth = require('../middlewares/auth');

var auth = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var methos = require('../controller/protoType');

var router = _express2.default.Router({ caseSensitive: true });

router.post('/signup', (0, _validation2.default)(_customer2.default.mobileSignup), (0, _errorHandler.catchErrors)(customerCtrl.mobileSignup));
router.post('/signin',
// validate(customerValidator.mobileSignup),
(0, _errorHandler.catchErrors)(customerCtrl.mobileSignin));
router.post('/facebook', (0, _validation2.default)(_customer2.default.facebookLogin), customerCtrl.facebookLogin);
router.post('/google', (0, _validation2.default)(_customer2.default.googleLogin), customerCtrl.googleLogin);
router.post('/apple', customerCtrl.appleLogin);
router.post('/check-user-exist', (0, _validation2.default)(_customer2.default.appleLoginCheck), customerCtrl.appleLoginCheck);
router.post('/send-otp', (0, _validation2.default)(_customer2.default.sendOtp), (0, _errorHandler.catchErrors)(customerCtrl.sendOtp));

router.post('/send-provider-otp', (0, _validation2.default)(_customer2.default.sendOtp), (0, _errorHandler.catchErrors)(customerCtrl.sendProviderOtp));

router.post('/verify-otp', (0, _validation2.default)(_customer2.default.verifyOtp), (0, _errorHandler.catchErrors)(customerCtrl.verifyOtp));

router.post('/provider-verify-otp', (0, _validation2.default)(_customer2.default.verifyOtp), (0, _errorHandler.catchErrors)(customerCtrl.providerVerifyOtp));

router.post('/generate-otp', (0, _errorHandler.catchErrors)(customerCtrl.generateOtp));
router.post('/check', (0, _errorHandler.catchErrors)(customerCtrl.contactCheck));
router.post('/checkuser', (0, _errorHandler.catchErrors)(customerCtrl.checkuser));
router.post('/reauthenticate', auth.ensureAuth, (0, _errorHandler.catchErrors)(customerCtrl.reauthenticateOTP));
router.post('/get-latest-device/:role', auth.ensureAuth, (0, _validation2.default)(_customer2.default.getLatestDeviceId), (0, _errorHandler.catchErrors)(customerCtrl.getLatestDeviceId));
router.post('/otp/check', auth.ensureAuth, (0, _errorHandler.catchErrors)(customerCtrl.reVerifyingOtp));
router.get('/test', customerCtrl.tester);

router.post('/social/contact', auth.ensureAuth, (0, _errorHandler.catchErrors)(customerCtrl.addContactForSocialSignup));
router.post('/social/verify-mobile', (0, _validation2.default)(_customer2.default.socail_verify_contact), (0, _errorHandler.catchErrors)(customerCtrl.socialVerifyContactNumber));

router.get('/', auth.ensureAuth, (0, _errorHandler.catchErrors)(customerCtrl.getCustomerById));
router.put('/', auth.ensureAuth, (0, _validation2.default)(_customer2.default.editCustomer), (0, _errorHandler.catchErrors)(customerCtrl.editCustomer));

router.post('/address', auth.ensureAuth, (0, _errorHandler.catchErrors)(customerCtrl.addAddress));
router.put('/address/:addressId', auth.ensureAuth, (0, _errorHandler.catchErrors)(customerCtrl.updateAddress));
router.delete('/address/:addressId', auth.ensureAuth, (0, _errorHandler.catchErrors)(customerCtrl.deleteAddress));

// Admin Routes

router.get('/admin/all', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(customerCtrl.getCustomerList));
router.get('/admin/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(customerCtrl.getById));
router.post('/admin/add', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(customerCtrl.add));

router.post('/create', (0, _errorHandler.catchErrors)(customerCtrl.create));

router.put('/admin/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(customerCtrl.updateUser));
router.delete('/admin/all', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(customerCtrl.removeAll));
router.delete('/admin/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(customerCtrl.remove));
router.get('/admin/history/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(customerCtrl.history));

exports.default = router;