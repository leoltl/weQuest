import App from './app';

import * as bodyParser from 'body-parser';
import morgan = require('morgan');
import UserController from './routes/user.router';
import UserRequestController from './routes/request-router';

import { config } from 'dotenv';
config();

const app = new App({
  port: process.env.PORT || '8080',
  controllers: [new UserController(), new UserRequestController()],
  middleWares: [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    morgan('dev'),
  ],
});

app.listen();
