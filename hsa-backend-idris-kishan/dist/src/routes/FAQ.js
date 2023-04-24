'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _faqCtrl = require('../controller/faqCtrl');

var faqCtrl = _interopRequireWildcard(_faqCtrl);

var _errorHandler = require('../handler/errorHandler');

var _auth = require('../middlewares/auth');

var auth = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router({ caseSensitive: true });

router.get('/', (0, _errorHandler.catchErrors)(faqCtrl.index));
router.get('/statsByCategeory', (0, _errorHandler.catchErrors)(faqCtrl.getFAQStatsByCategory));
router.get('/:category', (0, _errorHandler.catchErrors)(faqCtrl.getFAQByCategory));
router.get('/history', (0, _errorHandler.catchErrors)(faqCtrl.getFAQHistory));
router.get('/history/:id', (0, _errorHandler.catchErrors)(faqCtrl.getFAQHistoryById));
router.post('/', auth.ensureAuth, (0, _errorHandler.catchErrors)(faqCtrl.add));
router.patch('/:id', auth.ensureAuth, (0, _errorHandler.catchErrors)(faqCtrl.update));
router.delete('/all', auth.ensureAuth, (0, _errorHandler.catchErrors)(faqCtrl.removeAll));
router.delete('/:id', auth.ensureAuth, (0, _errorHandler.catchErrors)(faqCtrl.remove));

exports.default = router;