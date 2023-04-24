'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.server = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('./config/config');

var _config2 = _interopRequireDefault(_config);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _logger = require('./utils/logger');

var _logger2 = _interopRequireDefault(_logger);

var _locationCtrl = require('./src/controller/locationCtrl');

var mapCtrl = _interopRequireWildcard(_locationCtrl);

var _cronJobs = require('./src/handler/cron-jobs');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var https = require('https'); // Start our app!

var path = require('path');
var fs = require('fs');
var server = exports.server = require('http').Server(_app2.default);
var io = require('socket.io')(server);
var track = io.of('/track');
var protoTypeMethods = require('./src/controller/protoType');
// import * as faker from 'faker';

protoTypeMethods.setSocketObject(track);

// var socket = io.connect('https://obscure-journey-86933/track');
// var socket = io.connect('http://localhost:3001/track', { query: "service_id=PgdITVvsNJ" });
// let longitude, latitude;
// setInterval(() => {
// 	// longitude = faker.address.longitude();
// 	// latitude = faker.address.latitude();
// 	console.log("latlong :>>>", { longitude, latitude });
// 	track.emit('gettingPosition');

// }, 9000);

//const mongoURL = `mongodb+srv://${config.DATABASE.DB_USER}:${config.DATABASE.DB_PWD}@${config.DATABASE.DB_URL}`;

var mongoURL = 'mongodb+srv://hameedservice:kishan123@hsa-olchk.mongodb.net/hsanew?retryWrites=true&w=majority';

// const mongoURL = 'mongodb://localhost/hsappnewapp';

//connect mongodb database
_mongoose2.default.connect(mongoURL || process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

_mongoose2.default.set('debug', true);

// Handle error event
_mongoose2.default.connection.on('error', function (err) {
  _logger2.default.info('Mongoose connection error : ', err);
  process.exit(0);
});

// Handle disconnected event k
_mongoose2.default.connection.on('disconnected', function () {
  _logger2.default.info('Mongoose disconnected.');
});

// Handle application termination event
process.on('SIGINT', function () {
  _mongoose2.default.connection.close(function () {
    _logger2.default.info('MongoDB disconnected through application termination.');
    process.exit(0);
  });
});

(0, _cronJobs.dailyCron)();

// server.listen(app.get('port'), () => {
// 	console.log(`Express running → PORT ${app.get('port')}`);
// });

server.listen(_config2.default.PORT, function () {
  console.log('Express running \u2192 PORT ' + _config2.default.PORT + ', ' + mongoURL);
});

// const sslServer = https.createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
//     cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
//   },
//   app
// );

// sslServer.listen(3443, () => console.log("Secure server 🚀🔑 on port 3443"));

track.on('connection', function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(socket) {
    var room;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('New Socket is connected', socket.id);

            if (socket.handshake.query.service_id !== undefined) {
              room = 'room-' + socket.handshake.query.service_id;

              socket.join(room);
              console.log('ROOM------------', room);
            }
            _context.next = 4;
            return mapCtrl.locationTracker(socket, socket.handshake.query.service_id, room, track);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

process.on('unhandledRejection', function (err) {
  _logger2.default.error('Unhandled Promise Rejection: reason:', err.message);
  _logger2.default.error(err.stack);
});