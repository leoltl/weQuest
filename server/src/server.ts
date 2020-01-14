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
import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';
import { dbParams, storageParams } from './lib/config-vars';
import DB from './lib/db';
import Storage from './lib/storage';
import Socket from './lib/socket';
import { sessionIdParser, forceSession, storeSessionId } from './lib/utils';
import path from 'path';

// server config
const ENV = process.env.ENV || 'development';
const PORT = parseInt(process.env.PORT || '8080', 10);

// instantiate db and storage
const db = new DB(dbParams);
const storage = new Storage(storageParams);

// const app = new App({
//   port: PORT,
//   controllers: [
//     new UserController(db),
//     new RequestController(db),
//     new BidController(db),
//     new ItemController(db, storage),
//   ],
//   middlewares: [
//     morgan('dev'),
//     bodyParser.json({ limit: '10mb' }),
//     bodyParser.urlencoded({ limit: '10mb', extended: true }),
//     cookieParser('Coolstuffgoesonhere'),
//     cookieSession({
//       name: 'session',
//       keys: ['Coolstuffgoesonhere'],
//       maxAge: 365 * 24 * 60 * 60 * 1000 /* 1 year */,
//     }),
//   ],
// });

// // dummy login for dev
// app.app.get('/api/login/:id', async (req, res) => {
//   req.session!.userId = parseInt(req.params.id, 10);
//   res.send(`Logged in as user: ${req.session!.userId}`);
// });

// app.app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// app.listen();

// SOCKET TEST
import express from 'express';

const app = express();

app.use([
  morgan('dev'),
  bodyParser.json({ limit: '10mb' }),
  bodyParser.urlencoded({ limit: '10mb', extended: true }),
  cookieSession({
    name: 'session',
    keys: ['Coolstuffgoesonhere'],
    maxAge: 365 * 24 * 60 * 60 * 1000 /* 1 year */,
  }),
  forceSession,
  sessionIdParser,
  storeSessionId,
]);

const server = http.createServer(app);
const socket = new Socket({ server, path: '/socket' });

const userController = new UserController(db);
const requestController = new RequestController(db, socket);
const bidController = new BidController(db, socket);
const itemController = new ItemController(db, storage);

app.use(userController.path, userController.router);
app.use(requestController.path, requestController.router);
app.use(bidController.path, bidController.router);
app.use(itemController.path, itemController.router);

// dummy login for dev
app.get('/api/login/:id', async (req, res) => {
  req.session!.userId = parseInt(req.params.id, 10);
  res.send(`Logged in as user: ${req.session!.userId}`);
});

app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/testsocket', (req, res) => {
  console.log(req);
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

server.listen(PORT, () => {
  console.log(`weQuest App listening on port ${PORT}`);
});
