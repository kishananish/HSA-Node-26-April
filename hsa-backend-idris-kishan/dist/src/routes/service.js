'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _serviceCtrl = require('../controller/serviceCtrl');

var serviceCtrl = _interopRequireWildcard(_serviceCtrl);

var _locationCtrl = require('../controller/locationCtrl');

var locationCtrl = _interopRequireWildcard(_locationCtrl);

var _errorHandler = require('../handler/errorHandler');

var _auth = require('../middlewares/auth');

var auth = _interopRequireWildcard(_auth);

var _language = require('../middlewares/language');

var localizaton = _interopRequireWildcard(_language);

var _validation = require('../middlewares/validation');

var _validation2 = _interopRequireDefault(_validation);

var _service = require('../validation/service');

var _service2 = _interopRequireDefault(_service);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router({ caseSensitive: true });

/* User routes */

router.post('/user', auth.ensureAuth, (0, _errorHandler.catchErrors)(serviceCtrl.add)); // create service request by user

router.get('/user', auth.ensureAuth, (0, _errorHandler.catchErrors)(serviceCtrl.serviceListForUser)); // create serviceList by user
router.get('/user/progress', auth.ensureAuth, (0, _errorHandler.catchErrors)(serviceCtrl.serviceListForUserByProgress));
router.post('/user/complain', auth.ensureAuth, (0, _validation2.default)(_service2.default.raiseComplainByUser), (0, _errorHandler.catchErrors)(serviceCtrl.addComplainForService));
router.get('/user/:id', auth.ensureAuth, (0, _errorHandler.catchErrors)(serviceCtrl.serviceByIdForUser));
router.put('/user/cancel/:service_id', auth.ensureAuth, (0, _validation2.default)(_service2.default.rejectNewServiceByUser), (0, _errorHandler.catchErrors)(serviceCtrl.rejectNewServiceByUser));
router.put('/user/:id', auth.ensureAuth, (0, _validation2.default)(_service2.default.acceptOrRejectServiceQuoteByUser), (0, _errorHandler.catchErrors)(serviceCtrl.acceptOrRejectServiceQuoteByUser));
// router.get('/user/:id', auth.ensureAuth, validate(serviceValidator.acceptOrRejectServiceQuoteByUser), catchErrors(serviceCtrl.acceptOrRejectServiceQuoteByUser));

/* Service_provider routes */
router.get('/provider', auth.ensureServiceProviderAuth, (0, _errorHandler.catchErrors)(serviceCtrl.serviceListForProvider));
router.get('/provider/progress', auth.ensureServiceProviderAuth, (0, _errorHandler.catchErrors)(serviceCtrl.serviceListForProviderByProgress));
router.get('/providers/statistics', auth.ensureServiceProviderAuth, (0, _errorHandler.catchErrors)(serviceCtrl.serviceProviderStatistics));
router.get('/provider/:id', auth.ensureServiceProviderAuth, (0, _errorHandler.catchErrors)(serviceCtrl.serviceByIdForProvider));
router.put('/provider/:id', auth.ensureServiceProviderAuth, localizaton.language, (0, _errorHandler.catchErrors)(serviceCtrl.updateServiceRequestByProvider));
router.get('/providers', auth.ensureServiceProviderAuth, (0, _errorHandler.catchErrors)(serviceCtrl.serviceProviderList));
router.post('/socket', auth.ensureServiceProviderAuth, (0, _errorHandler.catchErrors)(locationCtrl.locationTracker));

/* Admin Routes */
router.get('/admin/history', (0, _errorHandler.catchErrors)(serviceCtrl.getServiceHistory));
router.post('/admin/resolution', (0, _validation2.default)(_service2.default.complainResolution), (0, _errorHandler.catchErrors)(serviceCtrl.addComplainResolution));
router.get('/admin/history/:id', (0, _errorHandler.catchErrors)(serviceCtrl.getServiceHistory));
router.get('/admin', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(serviceCtrl.serviceListForAdmin));
router.get('/admin/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(serviceCtrl.serviceByIdForAdmin));
router.put('/admin/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(serviceCtrl.updateServiceRequestByAdmin));
router.delete('/admin/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(serviceCtrl.deleteSingleServiceByAdmin));
router.delete('/admin', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(serviceCtrl.deleteServiceByAdmin));

exports.default = router;