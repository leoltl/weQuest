// tslint:disable: import-name

// load .env data into process.env
import { config } from 'dotenv';
config();

import App from './app';
import http from 'http';
// import ReactController from './routes/react';
import UserController from './routes/users';
import RequestController from './routes/request';
import BidController from './routes/bids';
import ItemController from './routes/items';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';
import { dbParams, storageParams } from './lib/config-vars';
import DB from './lib/db';
import Storage from './lib/storage';
import Socket from './lib/socket';
const path = require('path');

// server config
const ENV = process.env.ENV || 'development';
const PORT = parseInt(process.env.PORT || '8080', 10);

// instantiate db and storage
const db = new DB(dbParams);
const storage = new Storage(storageParams);

const app = new App({
  port: PORT,
  controllers: [
    new UserController(db),
    new RequestController(db),
    new BidController(db),
    new ItemController(db, storage),
  ],
  middlewares: [
    morgan('dev'),
    bodyParser.json({ limit: '10mb' }),
    bodyParser.urlencoded({ limit: '10mb', extended: true }),
    cookieParser('Coolstuffgoesonhere'),
    cookieSession({
      name: 'session',
      keys: ['Coolstuffgoesonhere'],
      maxAge: 365 * 24 * 60 * 60 * 1000 /* 1 year */,
    }),
  ],
});

// dummy login for dev
app.app.get('/api/login/:id', async (req, res) => {
  req.session!.userId = parseInt(req.params.id, 10);
  res.send(`Logged in as user: ${req.session!.userId}`);
});

// app.app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// app.listen();

// SOCKET TEST
const server = http.createServer(app.app);
const socket = new Socket({ server, path: '/socket' });
// import http from 'http';
// import socketio from 'socket.io';
// const io = socketio(server, { path: '/socket' });

// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/index.html');
// });

// function decode(str: string): string {
//   return Buffer.from(str, 'base64').toString('utf8');
// }

// io.on('connection', (client) => {
//   client.use
//   console.log(
//     'someone connected',
//     client.handshake.headers.cookie.split('; ').reduce(
//       (session: any, item: string) => {
//         const [key, value] = item.split('=');
//         session[key] = decode(value);
//         return session;
//       }, {}),
//     );
//   client.emit('news', { hello: 'world' });
  // console.log('someone connected', client.handshake);
  // socket.emit('news', { hello: 'world' });
  // socket.on('my other event', function (data) {
  //   console.log(data);
  // });
// });

app.app.get('/testsocket', (req, res) => {
  console.log(socket);
});

app.app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

server.listen(PORT, () => {
  console.log(`weQuest App listening on port ${PORT}`);
});
