// load .env data into process.env
import { config } from 'dotenv';
config();

// Web server config
const PORT = process.env.PORT || 3000;
const ENV = process.env.ENV || 'development';

import * as express from 'express';
import * as morgan from 'morgan';

// instantiate express
const app = express();

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hey');
});

app.use('/test', express.static('public'));

// tslint:disable-next-line
app.listen(PORT, () => console.log(`weQuest app listening on port ${PORT}`));