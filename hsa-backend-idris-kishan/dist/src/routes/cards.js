'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _savedCardCtrl = require('../controller/savedCardCtrl');

var savedCardCtrl = _interopRequireWildcard(_savedCardCtrl);

var _errorHandler = require('../handler/errorHandler');

var _auth = require('../middlewares/auth');

var auth = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router({ caseSensitive: true });

router.post('/add', auth.ensureAuth, (0, _errorHandler.catchErrors)(savedCardCtrl.addCard));
router.put('/update/:id', auth.ensureAuth, (0, _errorHandler.catchErrors)(savedCardCtrl.updateCard));
router.delete('/remove/:id', auth.ensureAuth, (0, _errorHandler.catchErrors)(savedCardCtrl.deleteCard));
router.get('/', auth.ensureAuth, (0, _errorHandler.catchErrors)(savedCardCtrl.fetchCards));

exports.default = router;