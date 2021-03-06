// tslint:disable: import-name
import { Router, Request } from 'express';
import DB from '../lib/db';
import User, { UserInterface } from '../models/user';
import { sessionIdStore } from '../lib/utils';
import bcrypt from 'bcrypt';

export default class UserController {
  public path = '/api/users';
  public router: Router = Router();
  public model = new User();

  constructor(db: DB) {
    this.initRoutes(db);
  }

  private initRoutes(db: DB) {
    this.router.get('/', async (req, res) => {
      if (req.session!.userId) {
        const user = await this.model
          .findById(req.session!.userId)
          .run(db.query);
        return res.json(user);
      }
      res.json(null);
    });

    this.router.post('/', async (req, res) => {
      const user = (
        await this.model.findByEmail(req.body.user.email).run(db.query)
      )[0];
      if (user) {
        this.updateSession(req, user);
        res.json(user.id);
      } else {
        try {
          const hashPassword = bcrypt.hashSync(req.body.user.password, 10);
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
          res.json(userData);
        } catch (err) {
          res.status(400).send(err.message);
        }
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

        // map userId to sessionId
        sessionIdStore.set(userData.id, req.sessionId!);

        res.json(userData);
      } catch (err) {
        res.status(403).json({ error: err.message, isLoggedIn: false });
      }
    });

    // logout
    this.router.get('/logout', (req, res) => {
      sessionIdStore.delete({ userId: req.session!.userId });
      this.logout(req);
      res.end();
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
        const match = bcrypt.compareSync(password, user.password);
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
