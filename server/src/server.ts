// tslint:disable: import-name

import App from './app';
import UserController from './routes/users';
import RequestController from './routes/request-router';
import RequestControllerProtected from './routes/request-router-protected';
import BidController from './routes/bids';
import ItemController from './routes/items';
import morgan from 'morgan';
import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';
import { dbParams, storageParams } from './lib/config-vars';
import DB from './lib/db';
import Storage from './lib/storage';

// load .env data into process.env
import { config } from 'dotenv';
config();

// server config
const ENV = process.env.ENV || 'development';

// instantiate db and storage
const db = new DB(dbParams);
const storage = new Storage(storageParams);

const app = new App({
  port: parseInt(process.env.PORT || '8080', 10),
  controllers: [
    new UserController(db),
    new RequestController(),
    new RequestControllerProtected(),
    new BidController(db),
    new ItemController(db, storage),
  ],
  middlewares: [
    morgan('dev'),
    bodyParser.json({ limit: '10mb' }),
    bodyParser.urlencoded({ limit: '10mb', extended: true }),
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
app.listen();
