'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ListOfCities = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _formatResponse = require('../../utils/formatResponse');

var _formatResponse2 = _interopRequireDefault(_formatResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ListOfCities = exports.ListOfCities = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var cities;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        cities = [{
                            position: 1,
                            value: 'Abhā',
                            label: 'Abhā',
                            name: 'Abhā'
                        }, {
                            position: 2,
                            value: 'Ad Dammām',
                            label: 'Ad Dammām',
                            name: 'Ad Dammām'
                        }, {
                            position: 3,
                            value: 'Al Bāḩah',
                            label: 'Al Bāḩah',
                            name: 'Al Bāḩah'
                        }, {
                            position: 4,
                            value: 'Al Hufūf',
                            label: 'Al Hufūf',
                            name: 'Al Hufūf'
                        }, {
                            position: 5,
                            value: 'Al Kharj',
                            label: 'Al Kharj',
                            name: 'Al Kharj'
                        }, {
                            position: 6,
                            value: 'Al Mubarraz',
                            label: 'Al Mubarraz',
                            name: 'Al Mubarraz'
                        }, {
                            position: 7,
                            value: 'Al Qaţīf',
                            label: 'Al Qaţīf',
                            name: 'Al Qaţīf'
                        }, {
                            position: 8,
                            value: 'Al Ḩillah',
                            label: 'Al Ḩillah',
                            name: 'Al Ḩillah'
                        }, {
                            position: 9,
                            value: '‘Ar‘ar',
                            label: '‘Ar‘ar',
                            name: '‘Ar‘ar'
                        }, {
                            position: 10,
                            value: 'Aţ Ţā’if',
                            label: 'Aţ Ţā’if',
                            name: 'Aţ Ţā’if'
                        }, {
                            position: 11,
                            value: 'Buraydah',
                            label: 'Buraydah',
                            name: 'Buraydah'
                        }, {
                            position: 12,
                            value: 'Ḩā’il',
                            label: 'Ḩā’il',
                            name: 'Ḩā’il'
                        }, {
                            position: 13,
                            value: 'Jeddah',
                            label: 'Jeddah',
                            name: 'Jeddah'
                        }, {
                            position: 14,
                            value: 'Jāzān',
                            label: 'Jāzān',
                            name: 'Jāzān'
                        }, {
                            position: 15,
                            value: 'Khamīs Mushayţ',
                            label: 'Khamīs Mushayţ',
                            name: 'Khamīs Mushayţ'
                        }, {
                            position: 16,
                            value: 'Mecca',
                            label: 'Mecca',
                            name: 'Mecca'
                        }, {
                            position: 17,
                            value: 'Medina',
                            label: 'Medina',
                            name: 'Medina'
                        }, {
                            position: 18,
                            value: 'Najrān',
                            label: 'Najrān',
                            name: 'Najrān'
                        }, {
                            position: 19,
                            value: 'Riyadh',
                            label: 'Riyadh',
                            name: 'Riyadh'
                        }, {
                            position: 20,
                            value: 'Sakākā',
                            label: 'Sakākā',
                            name: 'Sakākā'
                        }, {
                            position: 21,
                            value: 'Tabūk',
                            label: 'Tabūk',
                            name: 'Tabūk'
                        }];

                        (0, _formatResponse2.default)(res, cities);

                    case 2:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function ListOfCities(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();