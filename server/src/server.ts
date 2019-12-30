import App from './app';

import * as bodyParser from 'body-parser';
import morgan = require('morgan');
import UserController from './routes/user.router';

<<<<<<< HEAD
// instantiate express
const app = express();

app.use(morgan('dev'));

// app.get('/', (req, res) => {
//   res.send('Hey');
// });

app.use(express.static(path.join(__dirname, 'public')));

// tslint:disable-next-line
app.listen(PORT, () => console.log(`weQuest app listening on port ${PORT}`));
=======
import { config } from 'dotenv';
config();

const app = new App({
  port: process.env.PORT || '8080',
  controllers: [new UserController()],
  middleWares: [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    morgan('dev'),
  ],
});

app.listen();
>>>>>>> dd77837fbf2311dfb2a9bb27fb544c8cc89db5bc
