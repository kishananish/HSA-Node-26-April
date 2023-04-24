'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _serviceRequestCtrl = require('../controller/serviceRequestCtrl');

var serviceRequestCtrl = _interopRequireWildcard(_serviceRequestCtrl);

var _errorHandler = require('../handler/errorHandler');

var _auth = require('../middlewares/auth');

var auth = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var imgDir = _path2.default.normalize(__dirname + '../../../public/images');

var Storage = _multer2.default.diskStorage({
	destination: function destination(req, file, callback) {
		callback(null, imgDir);
	},
	filename: function filename(req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
	}
});

var uploader = (0, _multer2.default)({ storage: Storage }).fields([{ name: 'request-images', maxCount: 5 }, { name: 'request-video', maxCount: 1 }]);

var router = _express2.default.Router({ caseSensitive: true });

router.get('/', auth.ensureAuth, (0, _errorHandler.catchErrors)(serviceRequestCtrl.index));
router.post('/', auth.ensureAuth, uploader, (0, _errorHandler.catchErrors)(serviceRequestCtrl.add));
router.patch('/:id', auth.ensureAuth, (0, _errorHandler.catchErrors)(serviceRequestCtrl.update));
router.delete('/:id', auth.ensureAuth, (0, _errorHandler.catchErrors)(serviceRequestCtrl.remove));

exports.default = router;