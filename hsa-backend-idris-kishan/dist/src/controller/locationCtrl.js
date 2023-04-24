'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.locationTracker = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _Location = require('../models/Location');

var _Location2 = _interopRequireDefault(_Location);

var _Service = require('../models/Service');

var _Service2 = _interopRequireDefault(_Service);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var locationTracker = exports.locationTracker = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(socket, service_id, room, track) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:

                        socket.on('gettingPosition', function () {
                            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(data) {
                                var longitude, latitude, datum;
                                return _regenerator2.default.wrap(function _callee2$(_context2) {
                                    while (1) {
                                        switch (_context2.prev = _context2.next) {
                                            case 0:
                                                longitude = data.coordinates.longitude, latitude = data.coordinates.latitude;

                                                console.log('lat log from location tracker :', { longitude: longitude, latitude: latitude });

                                                datum = {
                                                    longitude: longitude, latitude: latitude
                                                };


                                                track.in(room).emit('emittingPosition', datum);

                                                _context2.next = 6;
                                                return _Location2.default.findOne({ service_id: service_id }).then(function () {
                                                    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(doc) {
                                                        var location, service, start_location, end_location, _location;

                                                        return _regenerator2.default.wrap(function _callee$(_context) {
                                                            while (1) {
                                                                switch (_context.prev = _context.next) {
                                                                    case 0:
                                                                        if (!doc) {
                                                                            _context.next = 7;
                                                                            break;
                                                                        }

                                                                        // TODO: keep pushing the updated coordinates
                                                                        location = {
                                                                            coordinates: [data.coordinates.longitude, data.coordinates.latitude],
                                                                            type: 'point'
                                                                        };

                                                                        doc.current_coordinates.push(location);
                                                                        _context.next = 5;
                                                                        return doc.save();

                                                                    case 5:
                                                                        _context.next = 17;
                                                                        break;

                                                                    case 7:
                                                                        console.log('Creating new Location~~~~');

                                                                        // TODO: Initial location doc to be created
                                                                        _context.next = 10;
                                                                        return _Service2.default.findById(service_id).populate('service_provider_id', ['device_id', 'addresses']).populate('customer_id', ['device_id', 'addresses']);

                                                                    case 10:
                                                                        service = _context.sent;

                                                                        console.log(service.service_provider_id.addresses[0].location.coordinates);
                                                                        start_location = {
                                                                            location: {
                                                                                coordinates: service.service_provider_id.addresses[0].location.coordinates,
                                                                                type: 'point'
                                                                            }
                                                                        };
                                                                        end_location = {
                                                                            location: {
                                                                                coordinates: [service.longitude, service.latitude],
                                                                                type: 'point'
                                                                            }
                                                                        };
                                                                        _location = new _Location2.default({
                                                                            service_id: service._id,
                                                                            start_location_coordinates: [start_location], // current coordinate of the provider
                                                                            end_location_coordinates: [end_location] // coordinate for the requested service location
                                                                        });
                                                                        _context.next = 17;
                                                                        return _location.save();

                                                                    case 17:
                                                                    case 'end':
                                                                        return _context.stop();
                                                                }
                                                            }
                                                        }, _callee, undefined);
                                                    }));

                                                    return function (_x6) {
                                                        return _ref3.apply(this, arguments);
                                                    };
                                                }()).catch(function (err) {
                                                    if (err && err.code === 11000) {
                                                        return null;
                                                    }
                                                    console.log('Error form Location doc---', err);
                                                });

                                            case 6:
                                            case 'end':
                                                return _context2.stop();
                                        }
                                    }
                                }, _callee2, undefined);
                            }));

                            return function (_x5) {
                                return _ref2.apply(this, arguments);
                            };
                        }());

                        // On disconnection
                        socket.on('disconnect', function () {
                            socket.leave('room-' + socket.handshake.query.service_id);
                            console.log('Connection ' + socket.id + ' has left the socket-connection');
                        });

                    case 2:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function locationTracker(_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
    };
}();