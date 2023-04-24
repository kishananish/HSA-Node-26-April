'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _swaggerUiExpress = require('swagger-ui-express');

var _swaggerUiExpress2 = _interopRequireDefault(_swaggerUiExpress);

var _yamljs = require('yamljs');

var _yamljs2 = _interopRequireDefault(_yamljs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _config = require('./config/config');

var _config2 = _interopRequireDefault(_config);

var _index = require('./src/routes/index');

var _index2 = _interopRequireDefault(_index);

var _errorHandler = require('./src/handler/errorHandler');

var _errorHandler2 = _interopRequireDefault(_errorHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

// view engine setup
/* eslint-disable indent */
/* eslint-disable no-console */
app.set('views', _path2.default.join(__dirname, 'views')); // this is the folder where we keep our pug files
app.set('view engine', 'pug'); // we use the engine pug

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(_express2.default.static(_path2.default.join(__dirname, 'public')));

app.set('case sensitive routing', true);
app.set('env', _config2.default.ENV);
app.set('port', _config2.default.PORT);

var swaggerDocument = _yamljs2.default.load('./doc/swagger/swagger.yaml');
swaggerDocument.host = _config2.default.SWAGGER_URL;

var swagOptions = {
  explorer: false,
  customCss: '.swagger-ui .topbar { display: none }'
};
app.use('/docs', _swaggerUiExpress2.default.serve, _swaggerUiExpress2.default.setup(swaggerDocument, swagOptions));

app.use((0, _cors2.default)());
app.use((0, _helmet2.default)());
app.use((0, _compression2.default)());
app.use(_bodyParser2.default.json({ limit: '1024mb' }));
app.use(_bodyParser2.default.urlencoded({ extended: true, limit: '1024mb' }));

app.use(function (req, res, next) {
  console.log('Request Body', req.body);
  console.log('Request Query', req.query);
  console.log('HTTP Method', req.method);
  console.log('Endpoint--', req.originalUrl);
  next();
});

// only for testing payfort page
app.get('/directTransaction', function (req, res) {
  console.log('After 3d url response');
  console.log('Request.Url = ', req.url);
  console.log('Request.method ==', req.method);
  console.log('Request.body = ', req.body);
  return res.status(200).send('directTransaction');
});
app.post('/payfortNotification', function (req, res) {
  console.log('Request.Url = ', req.url);
  console.log('Request.method = ', req.method);
  console.log('Request.body = ', req.body);
  return res.status(200).send('payfortNotification');
});
app.post('/payfortRedirect', function (req, res) {
  console.log('Request.Url = ', req.url);
  console.log('Request.method = ', req.method);
  console.log('Request.body = ', req.body);
  return res.status(200).send('payfortRedirect');
});
app.use('/api', _index2.default);

// If that above routes didn't work, we 404 them and forward to error handler
app.use(_errorHandler2.default.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(_errorHandler2.default.validationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(_errorHandler2.default.developmentErrors);
}

// production error handler
app.use(_errorHandler2.default.productionErrors);

exports.default = app;