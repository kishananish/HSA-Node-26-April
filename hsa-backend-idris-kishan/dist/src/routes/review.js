'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _reviewCtrl = require('../controller/reviewCtrl');

var reviewCtrl = _interopRequireWildcard(_reviewCtrl);

var _errorHandler = require('../handler/errorHandler');

var _auth = require('../middlewares/auth');

var auth = _interopRequireWildcard(_auth);

var _validation = require('../middlewares/validation');

var _validation2 = _interopRequireDefault(_validation);

var _review = require('../validation/review');

var _review2 = _interopRequireDefault(_review);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router({ caseSensitive: true });

router.post('/customer', auth.ensureAuth, (0, _validation2.default)(_review2.default.giveReviewToProvider), (0, _errorHandler.catchErrors)(reviewCtrl.giveReviewToProvider));
router.post('/provider', auth.ensureServiceProviderAuth, (0, _validation2.default)(_review2.default.giveReviewToCustomer), (0, _errorHandler.catchErrors)(reviewCtrl.giveReviewToCustomer));

exports.default = router;