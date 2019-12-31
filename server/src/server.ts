import App from './app';

import * as bodyParser from 'body-parser';
import morgan = require('morgan');
import cors = require('cors');
import UserController from './routes/user.router';
import RequestController from './routes/request-router';
import ProtectedRequestController from './routes/request-router-protected';

import { config } from 'dotenv';
config();

const app = new App({
  port: process.env.PORT || '8080',
  controllers: [
    new UserController(),
    new RequestController(),
    new ProtectedRequestController(),
  ],
  middleWares: [
    cors(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    morgan('dev'),
  ],
});

app.listen();
