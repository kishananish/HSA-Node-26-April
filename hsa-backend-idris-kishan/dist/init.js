'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('./config/config');

var _config2 = _interopRequireDefault(_config);

var _User = require('./src/models/User');

var _User2 = _interopRequireDefault(_User);

var _Role = require('./src/models/Role');

var _Role2 = _interopRequireDefault(_Role);

var _readlineSync = require('readline-sync');

var _readlineSync2 = _interopRequireDefault(_readlineSync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise; /* eslint-disable */


var mongoURL = _config2.default.DATABASE.DB_USER && _config2.default.DATABASE.DB_PWD ? 'mongodb://' + _config2.default.DATABASE.DB_USER + ':' + _config2.default.DATABASE.DB_PWD + '@' + _config2.default.DATABASE.DB_HOST + ':' + _config2.default.DATABASE.DB_PORT + '/' + _config2.default.DATABASE.DB_NAME : 'mongodb://' + _config2.default.DATABASE.DB_HOST + ':' + _config2.default.DATABASE.DB_PORT + '/' + _config2.default.DATABASE.DB_NAME;

//connect mongodb database
_mongoose2.default.connect(mongoURL, { useNewUrlParser: true });

var roleData = [{
	name: 'admin',
	active: true,
	isDeleted: false,
	access_level: [{
		name: 'Manage Customers',
		actions: {
			add: true,
			edit: true,
			view: true,
			delete: true,
			payment: true
		}
	}, {
		name: 'Manage Users',
		actions: {
			add: true,
			edit: true,
			view: true,
			delete: true,
			payment: true
		}
	}, {
		name: 'Manage Service Request',
		actions: {
			add: true,
			edit: true,
			view: true,
			delete: true,
			payment: true
		}
	}, {
		name: 'Manage Category',
		actions: {
			add: true,
			edit: true,
			view: true,
			delete: true,
			payment: true
		}
	}, {
		name: 'Manage Sub-Category',
		actions: {
			add: true,
			edit: true,
			view: true,
			delete: true,
			payment: true
		}
	}, {
		name: 'Manage Material',
		actions: {
			add: true,
			edit: true,
			view: true,
			delete: true,
			payment: true
		}
	}, {
		name: 'Manage FAQ',
		actions: {
			add: true,
			edit: true,
			view: true,
			delete: true,
			payment: true
		}
	}, {
		name: 'Manage Promo Code',
		actions: {
			add: true,
			edit: true,
			view: true,
			delete: true,
			payment: true
		}
	}, {
		name: 'Manage Query / Suggestion',
		actions: {
			add: true,
			edit: true,
			view: true,
			delete: true,
			payment: true
		}
	}, {
		name: 'Notifications',
		actions: {
			add: true,
			edit: true,
			view: true,
			delete: true,
			payment: true
		}
	}, {
		name: 'Manage Roles',
		actions: {
			add: true,
			edit: true,
			view: true,
			delete: true,
			payment: true
		}
	}, {
		name: 'Reports',
		actions: {
			add: true,
			edit: true,
			view: true,
			delete: true,
			payment: true
		}
	}]
}, {
	name: 'service_provider',
	active: true,
	isDeleted: false,
	access_level: [{
		name: 'Manage Customers',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}, {
		name: 'Manage Users',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}, {
		name: 'Manage Service Request',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}, {
		name: 'Manage Category',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}, {
		name: 'Manage Sub-Category',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}, {
		name: 'Manage Material',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}, {
		name: 'Manage FAQ',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}, {
		name: 'Manage Promo Code',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}, {
		name: 'Manage Query / Suggestion',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}, {
		name: 'Notifications',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}, {
		name: 'Manage Roles',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}, {
		name: 'Reports',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}]
}, {
	name: 'user',
	active: true,
	isDeleted: false,
	access_level: [{
		name: 'Manage Customers',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}, {
		name: 'Manage Users',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}, {
		name: 'Manage Service Request',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}, {
		name: 'Manage Category',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}, {
		name: 'Manage Sub-Category',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}, {
		name: 'Manage Material',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}, {
		name: 'Manage FAQ',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}, {
		name: 'Manage Promo Code',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}, {
		name: 'Manage Query / Suggestion',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}, {
		name: 'Notifications',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}, {
		name: 'Manage Roles',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}, {
		name: 'Reports',
		actions: {
			add: false,
			edit: false,
			view: false,
			delete: false,
			payment: false
		}
	}]
}];

var createUser = function () {
	var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
		var role, foundRole, adminRole, email, foundUser, first_name, last_name, password, user;
		return _regenerator2.default.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.prev = 0;
						role = ['admin', 'service_provider', 'user'];
						_context.next = 4;
						return _Role2.default.find({ name: { $in: role } });

					case 4:
						foundRole = _context.sent;

						if (foundRole.length) {
							_context.next = 8;
							break;
						}

						_context.next = 8;
						return _Role2.default.insertMany(roleData);

					case 8:
						_context.next = 10;
						return _Role2.default.findOne({ name: 'admin' });

					case 10:
						adminRole = _context.sent;
						email = _readlineSync2.default.questionEMail('Enter email: ');
						_context.next = 14;
						return _User2.default.findOne({ email: email });

					case 14:
						foundUser = _context.sent;

						if (foundUser) {
							console.log('Admin User exist!');
							process.exit(0);
						}
						first_name = _readlineSync2.default.question('Enter first name: ');
						last_name = _readlineSync2.default.question('Enter last name: ');
						password = _readlineSync2.default.questionNewPassword('password: ', { min: 8, max: 20 });
						user = {
							first_name: first_name,
							last_name: last_name,
							email: email,
							password: password,
							role: adminRole._id,
							active: true
						};
						_context.next = 22;
						return _User2.default.create(user);

					case 22:
						console.log('Admin User Created!');
						process.exit(0);
						_context.next = 30;
						break;

					case 26:
						_context.prev = 26;
						_context.t0 = _context['catch'](0);

						console.log(_context.t0);
						process.exit(1);

					case 30:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined, [[0, 26]]);
	}));

	return function createUser() {
		return _ref.apply(this, arguments);
	};
}();

createUser();