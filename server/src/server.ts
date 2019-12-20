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

<<<<<<< HEAD
app.use(morgan('dev'));

// app.get('/', (req, res) => {
//   res.send('Hey');
// });

app.use(express.static(path.join(__dirname, 'public')));

// tslint:disable-next-line
app.listen(PORT, () => console.log(`weQuest app listening on port ${PORT}`));
=======
app.get('/', (req, res) => {
  res.send('Hloerfkldsajflk;sjadklf;as1j2l');
});

// tslint:disable-next-line
app.listen(PORT, () => console.log(`Fuudi app listening on port ${PORT}`));
>>>>>>> db-setup
