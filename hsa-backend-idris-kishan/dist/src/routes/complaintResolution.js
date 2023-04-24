'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _complaintResolutionCtrl = require('../controller/complaintResolutionCtrl');

var complaintResolutionCtrl = _interopRequireWildcard(_complaintResolutionCtrl);

var _auth = require('../middlewares/auth');

var auth = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router({ caseSensitive: true });

router.post('/addResolution', auth.ensureAuth, complaintResolutionCtrl.addResolution);

router.post('/updateResolution', auth.ensureAuth, complaintResolutionCtrl.updateResolution);

exports.default = router;