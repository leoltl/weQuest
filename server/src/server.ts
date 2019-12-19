import path = require('path');

// load .env data into process.env
import { config } from 'dotenv';
config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || 'development';

import express = require('express');
import morgan = require('morgan');

// instantiate express
const app = express();

app.use(morgan('dev'));

// app.get('/', (req, res) => {
//   res.send('Hey');
// });

app.use(express.static(path.join(__dirname, 'public')));

// tslint:disable-next-line
app.listen(PORT, () => console.log(`weQuest app listening on port ${PORT}`));