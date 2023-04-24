'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.send = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _htmlToText = require('html-to-text');

var _htmlToText2 = _interopRequireDefault(_htmlToText);

var _pug = require('pug');

var _pug2 = _interopRequireDefault(_pug);

var _juice = require('juice');

var _juice2 = _interopRequireDefault(_juice);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _config = require('../../config/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_awsSdk2.default.config.update({
    accessKeyId: _config2.default.AWS.AWS_ACCESS_KEY,
    secretAccessKey: _config2.default.AWS.AWS_SECRET_KEY,
    region: 'ap-south-1'
});

var generateHTML = function generateHTML(filename) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var html = _pug2.default.renderFile(__dirname + '/../../views/email/' + filename + '.pug', options);
    var inlined = (0, _juice2.default)(html);
    return inlined;
};

var send = exports.send = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(options) {
        var html, text, tempalteName, params;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        html = generateHTML(options.filename, options);
                        text = _htmlToText2.default.fromString(html);
                        tempalteName = 'HSA-mailing_' + new Date().getTime();
                        params = {
                            Template: {
                                TemplateName: tempalteName,
                                HtmlPart: html,
                                SubjectPart: options.subject,
                                TextPart: text
                            }
                        };


                        new _awsSdk2.default.SES({}).createTemplate(params, function (err, data) {
                            console.log({ err: err, data: data });
                            if (err) {
                                console.log(err);
                                return err;
                            }
                            var config = {
                                Source: 'HSA Team <hsa1.hameedservice@gmail.com>',
                                Destination: {
                                    ToAddresses: [options.user.email]
                                },
                                Template: tempalteName,
                                TemplateData: (0, _stringify2.default)(html)
                            };

                            var sendPromise = new _awsSdk2.default.SES({}).sendTemplatedEmail(config).promise();
                            sendPromise.then(function (data) {
                                console.log('Success----------->', data.MessageId);
                            }).catch(function (err) {
                                console.error('Error--------------->', err, err.stack);
                            });
                        });

                    case 5:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function send(_x2) {
        return _ref.apply(this, arguments);
    };
}();