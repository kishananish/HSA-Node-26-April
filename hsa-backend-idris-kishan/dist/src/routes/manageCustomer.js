'use strict';

/**
 * Deprecated not more, as i have marge both user module only
 *
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _manageCustomerCtrl = require('../controller/manageCustomerCtrl');

var manageCustomerCtrl = _interopRequireWildcard(_manageCustomerCtrl);

var _auth = require('../middlewares/auth');

var auth = _interopRequireWildcard(_auth);

var _errorHandler = require('../handler/errorHandler');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router({ caseSensitive: true });

router.get('/getAll', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(manageCustomerCtrl.getAll));
router.get('/get/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(manageCustomerCtrl.getById));
router.post('/add', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(manageCustomerCtrl.add));
router.post('/update/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(manageCustomerCtrl.update));
router.get('/delete/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(manageCustomerCtrl.deleteUser));

exports.default = router;