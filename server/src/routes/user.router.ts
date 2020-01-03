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

    this.router.post('/login', async (req: Request, res: Response) => {
      try {
        if (!req.body.username || !req.body.password) {
          throw Error('No credentials supplied.');
        }
        const userData = await login(
          db,
          req,
          req.body.username,
          req.body.password,
        );
        res.json({ ...userData, isLoggedIn: true });
      } catch (err) {
        res.status(403).json({ error: err.message, isLoggedIn: false });
      }
    });

    // logout
    this.router.get('/logout', (req, res) => {
      logout(req);
      res.json({ isLoggedIn: false });
    });

    /* DELETE users/:id
    this.router.delete('/:id', async (req: Request, res: Response) => {
      try {
        const id: number = parseInt(req.params.id, 10);
        await UserService.remove(id);
        res.status(200);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });
    */
  }
}
