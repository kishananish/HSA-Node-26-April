'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _materialCtrl = require('../controller/materialCtrl');

var materialCtrl = _interopRequireWildcard(_materialCtrl);

var _errorHandler = require('../handler/errorHandler');

var _auth = require('../middlewares/auth');

var auth = _interopRequireWildcard(_auth);

var _validation = require('../middlewares/validation');

var _validation2 = _interopRequireDefault(_validation);

var _material = require('../validation/material');

var _material2 = _interopRequireDefault(_material);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router({ caseSensitive: true });

router.get('/', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(materialCtrl.getMaterials));
router.get('/history', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(materialCtrl.getMaterialHistory));
router.get('/history/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(materialCtrl.getMaterialHistoryById));
router.get('/provider', auth.ensureServiceProviderAuth, (0, _errorHandler.catchErrors)(materialCtrl.getMaterialsForProvider));
router.get('/provider/:id', auth.ensureServiceProviderAuth, (0, _errorHandler.catchErrors)(materialCtrl.getMaterialByIdForProvider));
router.get('/:id', auth.ensureServiceProviderAuth, (0, _errorHandler.catchErrors)(materialCtrl.getMaterialById));
// add material by admin and provider
router.post('/', auth.ensureAuth, (0, _validation2.default)(_material2.default.material), (0, _errorHandler.catchErrors)(materialCtrl.add));

//TODO change permission
router.put('/:id', auth.ensureAuth, (0, _errorHandler.catchErrors)(materialCtrl.update));
router.delete('/all', auth.ensureAuth, (0, _errorHandler.catchErrors)(materialCtrl.removeAll));
router.delete('/:id', auth.ensureAuth, (0, _errorHandler.catchErrors)(materialCtrl.remove));

exports.default = router;