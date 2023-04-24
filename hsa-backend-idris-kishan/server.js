// Start our app!
import mongoose from 'mongoose';
const https = require('https');
const path = require('path');
const fs = require('fs');
import config from './config/config';
import { default as app } from './app';
import logger from './utils/logger';
import * as mapCtrl from './src/controller/locationCtrl';
export const server = require('http').Server(app);
const io = require('socket.io')(server);
const track = io.of('/track');
const protoTypeMethods = require('./src/controller/protoType');
// import * as faker from 'faker';

import { dailyCron } from './src/handler/cron-jobs';

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

const mongoURL =
  'mongodb+srv://hameedservice:kishan123@hsa-olchk.mongodb.net/hsanew?retryWrites=true&w=majority';

// const mongoURL = 'mongodb://localhost/hsappnewapp';

//connect mongodb database
mongoose.connect(mongoURL || process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

mongoose.set('debug', true);

// Handle error event
mongoose.connection.on('error', function(err) {
  logger.info('Mongoose connection error : ', err);
  process.exit(0);
});

// Handle disconnected event k
mongoose.connection.on('disconnected', function() {
  logger.info('Mongoose disconnected.');
});

// Handle application termination event
process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    logger.info('MongoDB disconnected through application termination.');
    process.exit(0);
  });
});

dailyCron();

// server.listen(app.get('port'), () => {
// 	console.log(`Express running → PORT ${app.get('port')}`);
// });

server.listen(config.PORT, () => {
  console.log(`Express running → PORT ${config.PORT}, ${mongoURL}`);
});

// const sslServer = https.createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
//     cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
//   },
//   app
// );

// sslServer.listen(3443, () => console.log("Secure server 🚀🔑 on port 3443"));

track.on('connection', async (socket) => {
  console.log('New Socket is connected', socket.id);

  if (socket.handshake.query.service_id !== undefined) {
    var room = `room-${socket.handshake.query.service_id}`;
    socket.join(room);
    console.log('ROOM------------', room);
  }
  await mapCtrl.locationTracker(
    socket,
    socket.handshake.query.service_id,
    room,
    track
  );
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection: reason:', err.message);
  logger.error(err.stack);
});
