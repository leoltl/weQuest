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

export default class RequestController {
  public path = '/requests';
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get('/', async (req: Request, res: Response) => {
      try {
        const requests = await RequestService.findAll();
        res.status(200).send(requests);
      } catch (err) {
        res.status(400).send(err.message);
      }
    });

    /* GET users/:id */
    this.router.get('/:id', async (req: Request, res: Response) => {
      const id: number = parseInt(req.params.id, 10);
      try {
        const request = await RequestService.find(id);
        res.status(200).send(request);
      } catch (err) {
        res.status(400).send(err.message);
      }
    });
  }
}
