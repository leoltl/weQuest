// load .env data into process.env
import { config } from 'dotenv';
config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || 'development';

import * as express from 'express';
import * as morgan from 'morgan';

// instantiate express
const app = express();

app.get('/', (req, res) => {
  res.send('Helloerwerwe');
});

// tslint:disable-next-line
app.listen(PORT, () => console.log(`Fuudi app listening on port ${PORT}`));