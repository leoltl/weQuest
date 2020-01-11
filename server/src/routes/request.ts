// tslint:disable: import-name
/*
 * All routes for Requests are defined here
 * Since this file is loaded in server.js into api/users,
 * these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
import express, { Router, Request, Response } from 'express';
// import RequestService from '../models/RequestService';
// import { Request as UserRequest, Requests } from '../interfaces/requests';
import UserRequest from '../models/request';
import { accessControl } from '../lib/utils';

import Bid from '../models/bid';
import DB from '../lib/db';
import Socket from '../lib/socket';

export default class RequestController {
  public path: string = '/api/requests';
  public router: Router = express.Router();
  public model = new UserRequest();

  constructor(public db: DB, public socket: Socket) {
    this.init();
  }

  private init() {
    /* GET /api/requests */
    this.router.get('/', async (req: Request, res: Response) => {
      try {
        const requestData = await this.model.findAllActiveRequest().run(this.db.query);

        // const sessionId = req.cookies['session.sig'];
        const sessionId = req.sessionId!;
        requestData.forEach((request: Record<string, any>) => {
          this.socket.subscribe(sessionId, 'get-requests', String(request.id));
        });

        res.json(requestData);
      } catch (err) {
        res.status(400).send({ error: 'Failed to retrieve requests' });
      }
    });

    this.router.get('/active', async (req: Request, res: Response) => {
      try {
        const requestData = await this.model.findRequestsByStatus(req.session!.userId, 'active').run(this.db.query);
        res.json(requestData);
      } catch (err) {
        console.log(err)
        res.status(400).send({ error: 'Failed to retrieve active requests' });
      }
    });

    this.router.get('/completed', async (req: Request, res: Response) => {
      try {
        const requestData = await this.model.findRequestsByStatus(req.session!.userId, 'closed').run(this.db.query);
        res.json(requestData);
      } catch (err) {
        console.log(err);
        res.status(400).send({ error: 'Failed to retrieve completed requests' });
      }
    });

    /* GET reqeusts/:id */
    this.router.get('/:id', async (req: Request, res: Response) => {
      const id: number = parseInt(req.params.id, 10);
      try {
        const request = await this.model.findRequestById(id).run(this.db.query);
        res.json(request);
      } catch (err) {
        res.status(400).send({ error: 'Failed to retrieve request' });
      }
    });

    // authentication protected route below
    this.router.use(accessControl);

    /* POST requests/ */
    this.router.post('/', async (req: Request, res: Response) => {
      try {
        const userId: number = req.session!.userId;
        const request = req.body.payload;
        const borrowStart: String = new Date(request.borrowStart).toISOString();
        const borrowEnd: String = new Date(request.borrowEnd).toISOString();
        const requestData = { ...request, borrowStart, borrowEnd, userId: req.session!.userId, isActive: true,
          auctionStart: new Date().toISOString(), auctionEnd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        };
        await this.model.create({ ...requestData, userId }).run(this.db.query);
        res.sendStatus(201);
      } catch (err) {
        res.status(500).send({ error: 'Failed to create new request.' });
      }
    });

    /* PUT requests/ */
    this.router.put('/:id', async (req: Request, res: Response) => {
      const requestId: number = parseInt(req.params.id, 10);
      try {
        const userId = req.session!.userId;
        const request = await this.updateWinningBid(requestId, userId, req.body);
        if (!request) throw Error('Cannot find/update request');

        // send update through socket
        this.socket.broadcast('getRequests', request, { eventKey: String(request.id) });

        res.status(200).send(request);

      } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Failed to update request.' });
      }
    });

    /* GET /api/requests/:id/bids */
    this.router.get('/:id/bids', async (req: Request, res: Response) => {
      try {
        const requestId = parseInt(req.params.id, 10);
        const result = await new Bid().findByRequestSafe(requestId, req.session!.userId).run(this.db.query);
        res.json(result);

      } catch (err) {
        res.status(500).send({ error: 'Failed to retrieve bids for request' });
      }
    });
  }

  private updateWinningBid(requestId: number, userId: number, input: any) {
    return this.db.transaction(async (query) => {

      // update request status to closed when a winning bid is chosen
      const request = await this.model.update({ ...input, requestStatus: 'closed' }).where({ userId, id: requestId }).limit(1).run(query);

      // update all winning bids associated with the request column of is_Active to false
      await new Bid().update({ isActive: false }).where({ requestId }).run(query);

      return request;
    });
  }
}
