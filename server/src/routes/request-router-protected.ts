/*
 * All routes for Requests are defined here
 * Since this file is loaded in server.js into api/users,
 * these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
import * as express from 'express';
import { Request, Response } from 'express';
import * as RequestService from '../models/RequestService';
import { Request as UserRequest, Requests } from '../interfaces/requests';
import { isAuthenticated } from '../services/users';

export default class ProtectedRequestController {
  public path = '/requests';
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.use(isAuthenticated);
    /* POST requests/ */
    this.router.post('/', async (req: Request, res: Response) => {
      console.log(req.body);
      try {
        const request: UserRequest = req.body.data;
        await RequestService.create(request);
        res.sendStatus(201);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    /* PUT requests/ */
    this.router.put('/', async (req: Request, res: Response) => {
      try {
        const request: UserRequest = req.body.user;
        await RequestService.update(request);
        res.status(200);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    /* DELETE requests/:id */
    this.router.delete('/:id', async (req: Request, res: Response) => {
      try {
        const id: number = parseInt(req.params.id, 10);
        await RequestService.remove(id);
        res.status(200);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });
  }
}
