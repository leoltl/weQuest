// tslint:disable: import-name

import App from './app';
import cors = require('cors');
import UserController from './routes/user.router';
import RequestController from './routes/request-router';
import RequestControllerProtected from './routes/request-router-protected';

// import path from 'path';
// import express, { Router } from 'express';
import morgan from 'morgan';
import session from 'express-session';
import bodyParser from 'body-parser';
import { dbParams, storageParams } from './lib/config-vars';
import DB from './lib/db';
import Storage from './lib/storage';

// load .env data into process.env
import { config } from 'dotenv';
config();

// server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || 'development';

// instantiate db and storage
const db = new DB(dbParams);
const storage = new Storage(storageParams);

// instantiate express
// const app = express();

// register middlewares
// app.use(morgan('dev'));
// app.use(
//   session({
//     secret: 'Coolstuffgoesonhere',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 /* 1 year */ },
//   }),
// );

// // larger upload size to allow for image uploads
// app.use(bodyParser.json({ limit: '10mb' }));
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// import bids for test
import ItemRouter from './routes/items';
const itemrouter = new ItemRouter(db, storage);
// app.use(itemrouter.path, itemrouter.router);

const app = new App({
  port: process.env.PORT || '8080',
  controllers: [
    new UserController(),
    new RequestController(),
    new RequestControllerProtected(),
    itemrouter,
  ],
  middleWares: [
    morgan('dev'),
    bodyParser.json({ limit: '10mb' }),
    bodyParser.urlencoded({ limit: '10mb', extended: true }),
    session({
      secret: 'Coolstuffgoesonhere',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 /* 1 year */ },
    }),
    cors(),
  ],
});

// dummy login for dev
app.app.get('/api/login/:id', async (req, res) => {
  req.session!.userId = parseInt(req.params.id, 10);
  res.send(`Logged in as user: ${req.session!.userId}`);
});

// app.use(express.static(path.join(__dirname, 'public')));

// tslint:disable-next-line
app.listen();
// app.listen(PORT, () => console.log(`weQuest app listening on port ${PORT}`));
