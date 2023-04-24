'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _adminCtrl = require('../controller/adminCtrl');

var adminCtrl = _interopRequireWildcard(_adminCtrl);

var _validation = require('../middlewares/validation');

var _validation2 = _interopRequireDefault(_validation);

var _admin = require('../validation/admin');

var _admin2 = _interopRequireDefault(_admin);

var _errorHandler = require('../handler/errorHandler');

var _auth = require('../middlewares/auth');

var auth = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router({ caseSensitive: true });

router.post('/signin', (0, _errorHandler.catchErrors)(adminCtrl.signin));
router.post('/forgot', (0, _validation2.default)(_admin2.default.forgotPassword), (0, _errorHandler.catchErrors)(adminCtrl.forgotPassword));
router.get('/search-users', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(adminCtrl.searchUsers));
router.get('/reset/:token', (0, _validation2.default)(_admin2.default.resetPassword), (0, _errorHandler.catchErrors)(adminCtrl.resetPassword));

router.get('/payment',
//validate(adminValidator.resetPassword),
(0, _errorHandler.catchErrors)(adminCtrl.payment));

router.post('/update/:token', (0, _errorHandler.catchErrors)(adminCtrl.updatePassword));
router.post('/change-password', auth.ensureAdminAuth, (0, _validation2.default)(_admin2.default.changePassword), (0, _errorHandler.catchErrors)(adminCtrl.changePassword));
router.get('/', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(adminCtrl.getUser));
//router.post('/add-configuration', catchErrors(adminCtrl.addConfiguration));
exports.default = router;