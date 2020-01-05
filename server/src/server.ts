import path from 'path';
import express, { Router } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

// tslint:disable-next-line: import-name
import Storage from './lib/storage';

// load .env data into process.env
import { config } from 'dotenv';
config();

// server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || 'development';

// instantiate express
const app = express();

// register middlewares
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// instantiate storage
const storage = new Storage({
  accessKeyId: process.env.AWS_ACCESS_KEY as string,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  bucket: process.env.AWS_BUCKET as string });

app.get('/upload', (req, res) => res.json({ message: 'hello' }));

app.post('/upload', async (req, res) => {
  try {
    const data = await storage.upload64(req.body.image, `test${Date.now()}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/upload/delete', async (req, res) => {
  try {
    const data = await storage.delete(req.body.image);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

// tslint:disable-next-line
app.listen(PORT, () => console.log(`weQuest app listening on port ${PORT}`));
