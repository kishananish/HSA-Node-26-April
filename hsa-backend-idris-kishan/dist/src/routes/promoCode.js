'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _promoCodeCtrl = require('../controller/promoCodeCtrl');

var promoCodeCtrl = _interopRequireWildcard(_promoCodeCtrl);

var _auth = require('../middlewares/auth');

var auth = _interopRequireWildcard(_auth);

var _errorHandler = require('../handler/errorHandler');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router({ caseSensitive: true });
/**
 * Only ADMIN's CRUD operations on the PromoCodes are going for the history logs
 */
router.get('/', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(promoCodeCtrl.index));
router.get('/history', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(promoCodeCtrl.getPromoCodeHistory));
router.get('/history/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(promoCodeCtrl.getPromoCodeHistoryById));
router.post('/', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(promoCodeCtrl.add));
router.patch('/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(promoCodeCtrl.update));
router.delete('/all', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(promoCodeCtrl.removeAll));
router.delete('/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(promoCodeCtrl.remove));
router.post('/:category_id/apply', auth.ensureAuth, (0, _errorHandler.catchErrors)(promoCodeCtrl.apply));

exports.default = router;