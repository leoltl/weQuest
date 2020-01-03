/*
 * All routes for Requests are defined here
 * Since this file is loaded in server.js into api/users,
 * these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
import * as express from 'express';
import { Request, Response } from 'express';
const {
  getCurrentUser,
  login,
  logout,
  resetUserCookies,
  createUser,
} = require('../services/users');
import { User, Users } from '../interfaces/users';

export default class UserController {
  public path = '/users';
  public router = express.Router();

  constructor(db: any) {
    this.initRoutes(db);
  }

  private initRoutes(db: any) {
    this.router.post('/', async (req: Request, res: Response) => {
      try {
        const userId = await createUser(db, req.body);
        const userData = await login(db, req, null, null, userId);
        res.json({ ...userData, isLoggedIn: true });
      } catch (err) {
        res.status(400).send(err.message);
      }
    });

    /* GET users/:id */
    this.router.get('/login', async (req: Request, res: Response) => {
      const id: number = parseInt(req.params.id, 10);
      try {
        const user = getCurrentUser(req);
        if (!user) throw Error('User not logged in.');

        const userData = await login(db, req);
        res.json({ ...userData, isLoggedIn: true });
      } catch (err) {
        res.status(403).json({ error: err.message, isLoggedIn: false });
      }
    });

    /* POST users/ */
    this.router.post('/', async (req: Request, res: Response) => {
      try {
        const user: User = req.body.user;
        const newUser: any = await UserService.create(user);
        res.send(newUser);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    /* PUT users/ */
    this.router.put('/', async (req: Request, res: Response) => {
      try {
        const user: User = req.body.user;
        await UserService.update(user);
        res.status(200);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    /* DELETE users/:id */
    this.router.delete('/:id', async (req: Request, res: Response) => {
      try {
        const id: number = parseInt(req.params.id, 10);
        await UserService.remove(id);
        res.status(200);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });
  }
}

/* Old Implementation */
export const userRouter = express.Router();

userRouter.get('/', async (req: Request, res: Response) => {
  try {
    // const users: Users = await UserService.findAll();
    const users = 'test';
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* GET users/:id */
userRouter.get('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    // const user: User = await UserService.find(id);
    const user = 'test';
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* POST users/ */
userRouter.post('/', async (req: Request, res: Response) => {
  try {
    const user: User = req.body.user;
    await UserService.create(user);
    res.status(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* PUT users/ */
userRouter.put('/', async (req: Request, res: Response) => {
  console.log(req.body.user);
  try {
    const user: User = req.body.user;
    // await UserService.update(user);
    res.status(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* DELETE users/:id */
userRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    // await UserService.remove(id);
    res.status(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
