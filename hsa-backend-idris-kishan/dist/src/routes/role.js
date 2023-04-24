'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _roleCtrl = require('../controller/roleCtrl');

var roleCtrl = _interopRequireWildcard(_roleCtrl);

var _errorHandler = require('../handler/errorHandler');

var _auth = require('../middlewares/auth');

var auth = _interopRequireWildcard(_auth);

var _validation = require('../middlewares/validation');

var _validation2 = _interopRequireDefault(_validation);

var _role = require('../validation/role');

var _role2 = _interopRequireDefault(_role);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router({ caseSensitive: true });

router.get('/', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(roleCtrl.getRoles));
router.get('/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(roleCtrl.getRoleById));
router.post('/', auth.ensureAdminAuth, (0, _validation2.default)(_role2.default.role), (0, _errorHandler.catchErrors)(roleCtrl.add));
router.patch('/:id', auth.ensureAdminAuth, (0, _validation2.default)(_role2.default.role), (0, _errorHandler.catchErrors)(roleCtrl.update));
router.delete('/all', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(roleCtrl.removeAll));
router.delete('/:id', auth.ensureAdminAuth, (0, _errorHandler.catchErrors)(roleCtrl.remove));

exports.default = router;