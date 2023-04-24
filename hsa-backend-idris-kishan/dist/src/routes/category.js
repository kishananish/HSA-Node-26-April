'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _categoryCtrl = require('../controller/categoryCtrl');

var categoryCtrl = _interopRequireWildcard(_categoryCtrl);

var _errorHandler = require('../handler/errorHandler');

var _auth = require('../middlewares/auth');

var auth = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router({ caseSensitive: true });

router.get('/', (0, _errorHandler.catchErrors)(categoryCtrl.index));
router.get('/:id/sub-categories', (0, _errorHandler.catchErrors)(categoryCtrl.getRelatedSubCategories));
router.get('/history', (0, _errorHandler.catchErrors)(categoryCtrl.getCategoryHistory));
router.get('/history/:id', (0, _errorHandler.catchErrors)(categoryCtrl.getCategoryHistory));
router.post('/', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(categoryCtrl.add));
router.patch('/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(categoryCtrl.update));
router.delete('/all', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(categoryCtrl.removeAll));
router.delete('/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(categoryCtrl.remove));
router.get('/category-search', (0, _errorHandler.catchErrors)(categoryCtrl.searchCategories));

exports.default = router;