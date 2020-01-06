/*
 * All routes for Requests are defined here
 * Since this file is loaded in server.js into api/users,
 * these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
import express, { Router } from 'express';
import { Request, Response } from 'express';
// import RequestService from '../models/RequestService';
// import { Request as UserRequest, Requests } from '../interfaces/requests';
import { Request as UserRequest } from '../models/request';
import { accessControl } from '../lib/utils';

import DB from '../lib/db';

export default class RequestController {
  public path: String = '/api/requests';
  public router: Router = express.Router();
  public model = new UserRequest();

  constructor(db: DB) {
    this.init(db);
  }

  private init(db: DB) {
    this.router.get('/', async (req: Request, res: Response) => {
      try {
        const requestData = await this.findForRequestFeed(db);
        res.json(requestData);
      } catch (err) {
        res.status(400).send(err.message);
      }
    });

    /* GET reqeusts/:id */
    this.router.get('/:id', async (req: Request, res: Response) => {
      const id: number = parseInt(req.params.id, 10);
      try {
        const request = await this.findRequestById(id);
        res.status(200).send(request);
      } catch (err) {
        res.status(400).send(err.message);
      }
    });

    this.router.use(accessControl);

    /* POST requests/ */
    this.router.post('/', async (req: Request, res: Response) => {
      console.log(req.body);
      try {
        const request: UserRequest = req.body.data;
        await this.model.create(request);
        res.sendStatus(201);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    // /* PUT requests/ */
    // this.router.put('/', async (req: Request, res: Response) => {
    //   try {
    //     const request: UserRequest = req.body.user;
    //     await RequestService.update(request);
    //     res.status(200);
    //   } catch (err) {
    //     res.status(500).send(err.message);
    //   }
    // });

    // /* DELETE requests/:id */
    // this.router.delete('/:id', async (req: Request, res: Response) => {
    //   try {
    //     const id: number = parseInt(req.params.id, 10);
    //     await RequestService.remove(id);
    //     res.status(200);
    //   } catch (err) {
    //     res.status(500).send(err.message);
    //   }
    // });
  }

  private async findForRequestFeed(db: DB) {
    return await this.model
      .manual(
        `SELECT requests.id, requests.user_id, requests.description, requests.current_bid_id, users.name, users.email, bids.price_cent, bids.item_id 
    FROM requests LEFT JOIN users ON requests.user_id = users.id 
    LEFT JOIN bids on requests.current_bid_id = bids.id 
    ORDER BY requests.id 
    LIMIT 20`,
      )
      .run(db.query);
  }

  private async findRequestById(id: number) {
    return this.model.find(id);
  }
}
