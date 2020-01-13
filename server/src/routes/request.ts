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
import UserRequest, { RequestInterface } from '../models/request';
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
    // SEARCH AND REQUEST FEED
    this.router.get('/', async (req: Request, res: Response) => {
      try {
        const sessionId = req.sessionId!;
        let requests = [];

        // SEARCH TAB
        if (req.query.query) {
          requests = await this.model.findSafeByQuery(req.query.query, req.session!.userId).run(this.db.query);

        // REQUESTS FEED TAB
        } else {
          // fetch all active requests where user is not current user
          requests = await this.model
            .findAllActiveRequest(req.session!.userId ? [req.session!.userId] : undefined)
            .run(this.db.query);
        }

        requests.forEach((request: Record<string, any>) => {
          this.socket.subscribe(sessionId, 'get-requests', String(request.id));
        });

        res.json(requests);

      } catch (err) {
        console.log('ERROR', err);
        res.status(400).send({ error: 'Failed to retrieve requests' });
      }
    });

    // ACTIVITY FEED TAB - ACTIVE REQUESTS
    this.router.get('/active', async (req: Request, res: Response) => {
      try {
        const requests = await this.model.findSafeByUserId(req.session!.userId, 'active').run(this.db.query);

        // subscribe to updates for all retrieved request
        requests.forEach((request: Record<string, any>) => {
          this.socket.subscribe(req.sessionId!, 'get-requests', String(request.id));
        });

        res.json(requests);

      } catch (err) {
        console.log(err);
        res.status(400).send({ error: 'Failed to retrieve active requests' });
      }
    });

    // ACTIVITY FEED TAB - COMPLETED REQUESTS
    this.router.get('/completed', async (req: Request, res: Response) => {
      try {
        const requests = await this.model.findSafeByUserId(req.session!.userId, 'closed').run(this.db.query);

        // subscribe to updates for all retrieved request
        requests.forEach((request: Record<string, any>) => {
          this.socket.subscribe(req.sessionId!, 'get-requests', String(request.id));
        });

        res.json(requests);

      } catch (err) {
        console.log(err);
        res.status(400).send({ error: 'Failed to retrieve completed requests' });
      }
    });

    /* GET requests/:id */
    this.router.get('/:id', async (req: Request, res: Response) => {
      const id: number = parseInt(req.params.id, 10);
      try {
        const request = await this.model.findRequestById(id).run(this.db.query);

        // subscribe to updates
        this.socket.subscribe(req.sessionId!, 'get-requests', String(request.id));

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
        const requestData = {
          ...request, borrowStart, borrowEnd, userId: req.session!.userId, isActive: true,
          auctionStart: new Date().toISOString(), auctionEnd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        };
        await this.model.create({ ...requestData, userId }).run(this.db.query);
        res.sendStatus(201);

      } catch (err) {
        res.status(500).send({ error: 'Failed to create new request.' });
      }
    });

    /* PUT requests/ */
    // SELECT WINNING BID
    this.router.put('/:id', async (req: Request, res: Response) => {
      const requestId: number = parseInt(req.params.id, 10);
      try {
        const userId = req.session!.userId;
        const request = await this.updateWinningBid(requestId, userId, req.body);
        if (!request) throw Error('Cannot find/update request');

        // get updated data for socket
        const updatedRequest = await this.findById(request.id);
        const updatedBids = await new Bid().findByActivityRequestSafe(request.id).run(this.db.query);

        // send updates through socket
        this.socket.broadcast('get-requests', updatedRequest, { eventKey: String(request.id) });
        updatedBids.map((bid: any) => {
          this.socket.broadcast('get-bids', bid, { eventKey: String(bid.id) });
        });

        res.status(200).send(updatedRequest);

      } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Failed to update request.' });
      }
    });

    /* GET /api/requests/:id/bids */
    // BID MODAL
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
      const request = await this.model
        .update({
          ...input,
          currentBidId: input.winningBidId,
          requestStatus: 'closed',
        })
        .where({ userId, id: requestId })
        .limit(1)
        .run(query);

      // update all winning bids associated with the request column of is_Active to false
      await new Bid().update({ isActive: false }).where({ requestId }).run(query);

      return request;
    });
  }

  private findById(requestId: number) {
    return this.model.findSafe(requestId).run(this.db.query);
  }
}
