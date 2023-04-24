'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _customer = require('./customer');

var _customer2 = _interopRequireDefault(_customer);

var _category = require('./category');

var _category2 = _interopRequireDefault(_category);

var _complaint = require('./complaint');

var _complaint2 = _interopRequireDefault(_complaint);

var _complaintResolution = require('./complaintResolution');

var _complaintResolution2 = _interopRequireDefault(_complaintResolution);

var _subCategory = require('./subCategory');

var _subCategory2 = _interopRequireDefault(_subCategory);

var _FAQ = require('./FAQ');

var _FAQ2 = _interopRequireDefault(_FAQ);

var _contactUs = require('./contactUs');

var _contactUs2 = _interopRequireDefault(_contactUs);

var _promoCode = require('./promoCode');

var _promoCode2 = _interopRequireDefault(_promoCode);

var _role = require('./role');

var _role2 = _interopRequireDefault(_role);

var _accessLevels = require('./accessLevels');

var _accessLevels2 = _interopRequireDefault(_accessLevels);

var _serviceProvider = require('./serviceProvider');

var _serviceProvider2 = _interopRequireDefault(_serviceProvider);

var _admin = require('./admin');

var _admin2 = _interopRequireDefault(_admin);

var _serviceRequest = require('./serviceRequest');

var _serviceRequest2 = _interopRequireDefault(_serviceRequest);

var _service = require('./service');

var _service2 = _interopRequireDefault(_service);

var _payment = require('./payment');

var _payment2 = _interopRequireDefault(_payment);

var _AWSService = require('./AWSService');

var _AWSService2 = _interopRequireDefault(_AWSService);

var _AWSServicek = require('./AWSServicek');

var _AWSServicek2 = _interopRequireDefault(_AWSServicek);

var _manageUser = require('./manageUser');

var _manageUser2 = _interopRequireDefault(_manageUser);

var _review = require('./review');

var _review2 = _interopRequireDefault(_review);

var _dashboard = require('./dashboard');

var _dashboard2 = _interopRequireDefault(_dashboard);

var _report = require('./report');

var _report2 = _interopRequireDefault(_report);

var _firebaseService = require('./firebaseService');

var _firebaseService2 = _interopRequireDefault(_firebaseService);

var _material = require('./material');

var _material2 = _interopRequireDefault(_material);

var _notification = require('./notification');

var _notification2 = _interopRequireDefault(_notification);

var _activeTime = require('./activeTime');

var _activeTime2 = _interopRequireDefault(_activeTime);

var _city = require('./city');

var _city2 = _interopRequireDefault(_city);

var _cards = require('./cards');

var _cards2 = _interopRequireDefault(_cards);

var _configrations = require('./configrations');

var _configrations2 = _interopRequireDefault(_configrations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { default as user } from './user';
var router = _express2.default.Router({ caseSensitive: true });

router.use('/user', _customer2.default);
router.use('/categories', _category2.default);
router.use('/complaint', _complaint2.default);
router.use('/complaintResolution', _complaintResolution2.default);
router.use('/sub-categories', _subCategory2.default);
router.use('/faq', _FAQ2.default);
router.use('/contact-us', _contactUs2.default);
router.use('/promo-code', _promoCode2.default);
router.use('/role', _role2.default);
router.use('/access-level', _accessLevels2.default);

router.use('/service-request', _serviceRequest2.default);
router.use('/service', _service2.default);
router.use('/payment', _payment2.default);
router.use('/manageCustomer', _manageUser2.default);
router.use('/manageUser', _manageUser2.default);

router.use('/aws', _AWSService2.default);
router.use('/awsk', _AWSServicek2.default);
router.use('/firebase', _firebaseService2.default);

router.use('/providers', _serviceProvider2.default, _activeTime2.default, _notification2.default);
router.use('/admin', _admin2.default, _dashboard2.default, _report2.default, _notification2.default);
router.use('/review', _review2.default);
router.use('/material', _material2.default);
router.use('/cities', _city2.default);
router.use('/cards', _cards2.default);
router.use('/configuration', _configrations2.default);

exports.default = router;