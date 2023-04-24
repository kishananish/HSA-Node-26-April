'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _paymentCtrl = require('../controller/paymentCtrl');

var paymentCtrl = _interopRequireWildcard(_paymentCtrl);

var _errorHandler = require('../handler/errorHandler');

var _auth = require('../middlewares/auth');

var auth = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { default as validate } from '../middlewares/validation';

var router = _express2.default.Router({ caseSensitive: true });
// catchErrors()
router.post('/', auth.ensureAuth, (0, _errorHandler.catchErrors)(paymentCtrl.addPayment));
router.post('/admin/deposit', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(paymentCtrl.updatePayment));
router.get('/card/:id', paymentCtrl.getCardDetails);
router.post('/payfort/token', (0, _errorHandler.catchErrors)(paymentCtrl.getpayfortTokenSignature));
router.post('/payfort/merchantUrl', paymentCtrl.getPayfortMerchantUrl);
router.post('/updatepaymentstatus', paymentCtrl.updatePaymentStatus);
// catchErrors(
exports.default = router;