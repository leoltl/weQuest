// tslint:disable: import-name
import path from 'path';
import express, { Router } from 'express';
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
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || 'development';

// instantiate db and storage
const db = new DB(dbParams);
const storage = new Storage(storageParams);

// instantiate express
const app = express();

// register middlewares
app.use(morgan('dev'));
app.use(
  cookieSession({
    name: 'session',
    keys: ['Coolstuffgoesonhere'],
    maxAge: 24 * 60 * 60 * 1000,
  }),
);
// larger upload size to allow for image uploads
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// import bids for test
import ItemRouter from './routes/items';
const itemrouter = new ItemRouter(db, storage);
app.use(itemrouter.path, itemrouter.router);

import UserRouter from './routes/users';
const userrouter = new UserRouter(db);
app.use(userrouter.path, userrouter.router);

// dummy login for dev
app.get('/api/login/:id', async (req, res) => {
  req.session!.userId = parseInt(req.params.id, 10);
  res.send(`Logged in as user: ${req.session!.userId}`);
});

app.use(express.static(path.join(__dirname, 'public')));

// tslint:disable-next-line
app.listen(PORT, () => console.log(`weQuest app listening on port ${PORT}`));
