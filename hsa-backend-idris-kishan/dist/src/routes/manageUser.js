'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _manageUserCtrl = require('../controller/manageUserCtrl');

var manageUserCtrl = _interopRequireWildcard(_manageUserCtrl);

var _auth = require('../middlewares/auth');

var auth = _interopRequireWildcard(_auth);

var _errorHandler = require('../handler/errorHandler');

var _validation = require('../middlewares/validation');

var _validation2 = _interopRequireDefault(_validation);

var _admin = require('../validation/admin');

var _admin2 = _interopRequireDefault(_admin);

var _customer = require('../validation/customer');

var _customer2 = _interopRequireDefault(_customer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router({ caseSensitive: true });

router.get('/all', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(manageUserCtrl.getAll));
router.get('/get/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(manageUserCtrl.getById));
router.post('/add', (0, _validation2.default)(_customer2.default.mobileSignup), (0, _errorHandler.catchErrors)(manageUserCtrl.add)); //validate(adminValidator.addUser)

router.post('/createserviceprovider', (0, _validation2.default)(_customer2.default.serviceMobileSignup), (0, _errorHandler.catchErrors)(manageUserCtrl.createserviceprovider));

router.post('/update/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(manageUserCtrl.updateUser));
router.put('/delete/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(manageUserCtrl.remove));
router.put('/deleteAll', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(manageUserCtrl.removeAll));
router.get('/history/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(manageUserCtrl.history));

exports.default = router;