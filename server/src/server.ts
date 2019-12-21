import App from './app';

import * as bodyParser from 'body-parser';
import morgan = require('morgan');

import { config } from 'dotenv';
config();

const app = new App({
  port: process.env.PORT || '8080',
  controllers: [],
  middleWares: [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    morgan('dev'),
  ],
});

app.listen();
