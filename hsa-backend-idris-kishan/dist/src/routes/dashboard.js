'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _dashboardCtrl = require('../controller/dashboardCtrl');

var dashboardCtrl = _interopRequireWildcard(_dashboardCtrl);

var _errorHandler = require('../handler/errorHandler');

var _auth = require('../middlewares/auth');

var auth = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router({ caseSensitive: true });

router.get('/dashboard', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(dashboardCtrl.dashboard));
router.get('/dashboard/sale-chart', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(dashboardCtrl.saleGrowthGraph));
router.get('/dashboard/customer-growth', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(dashboardCtrl.customerGrowthGraph));

exports.default = router;