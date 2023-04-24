'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _subCategoryCtrl = require('../controller/subCategoryCtrl');

var subCategoryCtrl = _interopRequireWildcard(_subCategoryCtrl);

var _auth = require('../middlewares/auth');

var auth = _interopRequireWildcard(_auth);

var _errorHandler = require('../handler/errorHandler');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router({ caseSensitive: true });

router.get('/', (0, _errorHandler.catchErrors)(subCategoryCtrl.index));
router.get('/history', (0, _errorHandler.catchErrors)(subCategoryCtrl.getSubCategoryHistory));
router.get('/history/:id', (0, _errorHandler.catchErrors)(subCategoryCtrl.getSubCategoryHistory));
router.post('/', auth.ensureAuth, (0, _errorHandler.catchErrors)(subCategoryCtrl.add));
router.patch('/:id', auth.ensureAuth, (0, _errorHandler.catchErrors)(subCategoryCtrl.update));
router.delete('/all', auth.ensureAuth, (0, _errorHandler.catchErrors)(subCategoryCtrl.removeAll));
router.delete('/:id', auth.ensureAuth, (0, _errorHandler.catchErrors)(subCategoryCtrl.remove));

exports.default = router;