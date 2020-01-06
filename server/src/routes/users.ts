// tslint:disable: import-name
import { Router, Request, Response } from 'express';
import DB from '../lib/db';
import User, { UserInterface } from '../models/user';
import bcrypt from 'bcrypt';

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
        const userId = await this.model.createUser(req.body);
        const userData = await this.login(db, req, '', '');
        res.json(userData);
      } catch (err) {
        res.status(400).send(err.message);
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
    db: any,
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
        if (!bcrypt.compareSync(password, user.password)) {
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
}
