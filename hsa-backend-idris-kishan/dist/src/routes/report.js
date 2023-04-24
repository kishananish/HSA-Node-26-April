'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _reportCtrl = require('../controller/reportCtrl');

var reportCtrl = _interopRequireWildcard(_reportCtrl);

var _errorHandler = require('../handler/errorHandler');

var _auth = require('../middlewares/auth');

var auth = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router({ caseSensitive: true });

router.get('/report/service-request', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(reportCtrl.serviceRequest));
router.get('/report/rating', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(reportCtrl.getRating));
router.get('/report/earning', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(reportCtrl.totalEarning));
router.get('/report/active-time', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(reportCtrl.activeTimeReport));
router.get('/report/response-time', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(reportCtrl.responseTimeReport));

exports.default = router;