'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _winstonDailyRotateFile = require('winston-daily-rotate-file');

var _winstonDailyRotateFile2 = _interopRequireDefault(_winstonDailyRotateFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dir = './log';

if (!_fs2.default.existsSync(dir)) {
	_fs2.default.mkdirSync(dir);
}

var logger = _winston2.default.createLogger({
	transports: [new _winston2.default.transports.Console(), new _winstonDailyRotateFile2.default({
		level: 'error',
		filename: dir + '/error_',
		datePattern: 'YYYY-MM-DD',
		zippedArchive: true,
		maxSize: '20m',
		maxFiles: '14d'
	}), new _winstonDailyRotateFile2.default({
		level: 'info',
		filename: dir + '/info_',
		datePattern: 'YYYY-MM-DD',
		zippedArchive: true,
		maxSize: '20m',
		maxFiles: '14d'
	})]
});

exports.default = logger;