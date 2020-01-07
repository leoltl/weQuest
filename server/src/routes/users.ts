// tslint:disable: import-name
import { Router, Request } from 'express';
import DB from '../lib/db';
import User, { UserInterface } from '../models/user';
import bcrypt, { hash } from 'bcrypt';

export default class UserController {
  public path = '/api/users';
  public router: Router = Router();
  public model = new User();

  constructor(db: DB) {
    this.initRoutes(db);
  }

  private initRoutes(db: DB) {
    this.router.post('/', async (req, res) => {
      try {
        console.log('userData', req.body.user);
        const hashPassword = await bcrypt.hash(req.body.user.password, 10);
        const user = (
          await this.model
            .createUser({
              ...req.body.user,
              password: hashPassword,
            })
            .run(db.query)
        )[0];
        const userData = await this.login(
          db,
          req,
          req.body.user.email,
          req.body.user.password,
        );
        this.updateSession(req, userData);
        res.json(userData.id);
      } catch (err) {
        res.status(400).send(err.message);
        console.log(err);
      }
    });

    this.router.post('/login', async (req, res) => {
      try {
        if (!req.body.email || !req.body.password) {
          throw Error('No credentials supplied.');
        }
        const userData: UserInterface = await this.login(
          db,
          req,
          req.body.email,
          req.body.password,
        );
        req.session!.userId = userData.id;
        res.json(userData);
      } catch (err) {
        res.status(403).json({ error: err.message, isLoggedIn: false });
      }
    });

    // logout
    this.router.get('/logout', (req, res) => {
      this.logout(req);
      res.json({ isLoggedIn: false });
    });
  }

  private login = async (
    db: DB,
    req: Request,
    email: string,
    password: string,
  ) => {
    try {
      let userId = req.session!.Id;
      let user: UserInterface;
      if (!userId) {
        user = (
          await this.model
            .select()
            .where({ email })
            .run(db.query)
        )[0];
        console.log('error user', user);
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          throw Error(
            'Incorrect Password | email does not exist in our system',
          );
        }
        userId = user.id;
      } else {
        user = (
          await this.model
            .select()
            .where({ id: userId })
            .run(db.query)
        )[0];
      }
      return user;
    } catch (err) {
      throw Error(`Failed to login: ERROR: ${err}`);
    }
  };

  private logout = (req: Request) => {
    req.session!.userId && delete req.session!.userId;
  };

  private updateSession = (req: Request, user: UserInterface) => {
    req.session!.userId = user.id;
  };
}