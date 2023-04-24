'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Post = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import app from '../../app';


var server = _supertest2.default.agent('http://localhost:3000/api');

var Post = exports.Post = function Post(url, auth, params) {

	return new _promise2.default(function (resolve, reject) {

		server.post(url).expect('Content-type', /json/).send(params).expect(200).end(function (err, res) {
			if (err) reject(err);else resolve(res.body);
		});
	});
};