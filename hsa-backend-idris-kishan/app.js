/* eslint-disable indent */
/* eslint-disable no-console */
import express from 'express';
import bodyParser from 'body-parser';

import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import config from './config/config';
import routes from './src/routes/index';
import errorHandlers from './src/handler/errorHandler';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views')); // this is the folder where we keep our pug files
app.set('view engine', 'pug'); // we use the engine pug

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')));

app.set('case sensitive routing', true);
app.set('env', config.ENV);
app.set('port', config.PORT);

const swaggerDocument = YAML.load('./doc/swagger/swagger.yaml');
swaggerDocument.host = config.SWAGGER_URL;

const swagOptions = {
  explorer: false,
  customCss: '.swagger-ui .topbar { display: none }',
};
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swagOptions)
);

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bodyParser.json({ limit: '1024mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1024mb' }));

app.use((req, res, next) => {
  console.log('Request Body', req.body);
  console.log('Request Query', req.query);
  console.log('HTTP Method', req.method);
  console.log('Endpoint--', req.originalUrl);
  next();
});

// only for testing payfort page
app.get('/directTransaction', (req, res) => {
  console.log('After 3d url response');
  console.log('Request.Url = ', req.url);
  console.log('Request.method ==', req.method);
  console.log('Request.body = ', req.body);
  return res.status(200).send('directTransaction');
});
app.post('/payfortNotification', (req, res) => {
  console.log('Request.Url = ', req.url);
  console.log('Request.method = ', req.method);
  console.log('Request.body = ', req.body);
  return res.status(200).send('payfortNotification');
});
app.post('/payfortRedirect', (req, res) => {
  console.log('Request.Url = ', req.url);
  console.log('Request.method = ', req.method);
  console.log('Request.body = ', req.body);
  return res.status(200).send('payfortRedirect');
});
app.use('/api', routes);

// If that above routes didn't work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.validationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

export default app;
