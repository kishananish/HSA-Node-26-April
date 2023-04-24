'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.remove = exports.update = exports.add = exports.index = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _ServiceRequest = require('../models/ServiceRequest');

var _ServiceRequest2 = _interopRequireDefault(_ServiceRequest);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var protoTypeMethods = require('./protoType');

var index = exports.index = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var operator, items, page, skip, limit, count, serviceRequests, data;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        operator = req.user;
                        items = req.query.items ? req.query.items : 10;
                        page = req.query.page ? page : 1;
                        skip = items * (page - 1);
                        limit = parseInt(items);
                        _context.next = 7;
                        return _ServiceRequest2.default.find({}).countDocuments();

                    case 7:
                        count = _context.sent;
                        _context.next = 10;
                        return _ServiceRequest2.default.find({ requester: operator }).skip(skip).limit(limit);

                    case 10:
                        serviceRequests = _context.sent;
                        data = {
                            total: count,
                            pages: count % items === 0 ? count / items : parseInt(count / items) + 1,
                            result: serviceRequests
                        };


                        (0, _formatResponse2.default)(res, data);

                    case 13:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function index(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

// TODO: filter saved images names and video name
var add = exports.add = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var operator, images, video, i, img, imgName, videoFile, coordinates, track, newServiceRequest, serviceRequest;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        operator = req.user;
                        images = [];
                        video = null;


                        if (req.files && req.files != undefined) {
                            if (req.files['request-images'] && req.files['request-images'].length) {
                                for (i = 0; i < req.files['request-images'].length; i++) {
                                    img = req.files['request-images'][i];
                                    imgName = img.filename;

                                    images.push(imgName);
                                }
                            }

                            if (req.files['request-video'] && req.files['request-video'].length) {
                                videoFile = req.files['request-video'][0];

                                video = videoFile.filename;
                            }
                        }

                        coordinates = typeof req.body.coordinates === 'string' ? JSON.parse(req.body.coordinates) : req.body.coordinates;
                        track = protoTypeMethods.getSocketObject();

                        track.emit('gettingPosition', coordinates);
                        newServiceRequest = new _ServiceRequest2.default({
                            address: {
                                type: 'Point',
                                coordinates: coordinates
                            },
                            description: req.body.description,
                            photos: images,
                            video: video,
                            promoCode: req.body.promoCode,
                            requester: operator,
                            created_at: new Date()
                        });
                        _context2.prev = 8;
                        _context2.next = 11;
                        return newServiceRequest.save();

                    case 11:
                        serviceRequest = _context2.sent;


                        (0, _formatResponse2.default)(res, serviceRequest);
                        _context2.next = 18;
                        break;

                    case 15:
                        _context2.prev = 15;
                        _context2.t0 = _context2['catch'](8);

                        (0, _formatResponse2.default)(res, _context2.t0);

                    case 18:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined, [[8, 15]]);
    }));

    return function add(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();

var update = exports.update = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        var operator, id, serviceRequest, error, coordinates, newAddress;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        // The user is not allowed to change PromoCode or upload new images or video

                        operator = req.user;
                        id = req.params.id;
                        _context3.next = 4;
                        return _ServiceRequest2.default.find({ _id: id, requester: operator });

                    case 4:
                        serviceRequest = _context3.sent;

                        if (serviceRequest) {
                            _context3.next = 12;
                            break;
                        }

                        error = new Error('ServiceRequest not found!');

                        error.ar_message = 'لم يتم العثور على الخدمة!';
                        error.name = 'NotFound';
                        return _context3.abrupt('return', (0, _formatResponse2.default)(res, error));

                    case 12:

                        if (req.body.coordinates) {
                            coordinates = typeof req.body.coordinates === 'string' ? JSON.parse(req.body.coordinates) : req.body.coordinates;
                            newAddress = {
                                type: 'Point',
                                coordinates: coordinates
                            };


                            serviceRequest.address = newAddress;
                        }

                        serviceRequest.description = req.body.description || serviceRequest.description;
                        serviceRequest.updated_at = new Date();

                        _context3.prev = 15;
                        _context3.next = 18;
                        return serviceRequest.save();

                    case 18:
                        return _context3.abrupt('return', (0, _formatResponse2.default)(res, serviceRequest));

                    case 21:
                        _context3.prev = 21;
                        _context3.t0 = _context3['catch'](15);
                        return _context3.abrupt('return', (0, _formatResponse2.default)(res, _context3.t0));

                    case 24:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined, [[15, 21]]);
    }));

    return function update(_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}();

var remove = exports.remove = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
        var operator, removedObj;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        operator = req.user;
                        _context4.next = 3;
                        return _ServiceRequest2.default.findOneAndRemove({ _id: req.params.id, requester: operator });

                    case 3:
                        removedObj = _context4.sent;
                        return _context4.abrupt('return', (0, _formatResponse2.default)(res, removedObj ? removedObj : {}));

                    case 5:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function remove(_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
}();