'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _contactUsCtrl = require('../controller/contactUsCtrl');

var contactUsCtrl = _interopRequireWildcard(_contactUsCtrl);

var _errorHandler = require('../handler/errorHandler');

var _auth = require('../middlewares/auth');

var auth = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router({ caseSensitive: true });

router.get('/', auth.ensureAuth, (0, _errorHandler.catchErrors)(contactUsCtrl.index));
router.get('/admin', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(contactUsCtrl.queryForAdmin));
router.get('/history', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(contactUsCtrl.getContactUsHistory));
router.get('/history/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(contactUsCtrl.getContactUsHistoryById));
router.post('/', auth.ensureAuth, (0, _errorHandler.catchErrors)(contactUsCtrl.add));
router.patch('/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(contactUsCtrl.update));
router.delete('/all', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(contactUsCtrl.removeAll));
router.delete('/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(contactUsCtrl.remove));
router.get('/info', (0, _errorHandler.catchErrors)(contactUsCtrl.infoPage));

exports.default = router;