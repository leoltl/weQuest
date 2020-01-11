// tslint:disable: import-name
import { Router } from 'express';
import DB from '../lib/db';
import Socket from '../lib/socket';
import { accessControl } from '../lib/utils';
import Request from '../models/request';
import Bid, { BidInterface } from '../models/bid';
import { ItemInterface } from '../models/item';
import { emit } from 'cluster';

export default class BidController {
  public path: string = '/api/bids';
  public router: Router = Router();
  public model = new Bid();

  constructor(public db: DB, public socket: Socket) {
    this.init();
  }

  private init() {
    // confirm that user is authenticated
    this.router.use(accessControl);

    // declare routes
    this.router.route('/')
      .get(async (req, res) => {
        try {
          // const output = await this.getAllByUser(req.session!.userId);
          const isActive: boolean = req.query.completed || true;
          console.log('params', isActive);

          const bids = await this.model.findByUserSafe(req.session!.userId, isActive).run(this.db.query);

          // subscribe to updates for all retrieved bids
          const sessionId = req.cookies['session.sig'];
          bids.forEach((bid: Partial<BidInterface>) => {
            this.socket.subscribe(sessionId, 'get-bids', String(bid.id));
          });
          this.socket.broadcastToQueue('get-bids', { hello: 'world' }, { eventKey: '1' });

          res.json(bids);

        } catch (err) {
          res.status(404).json({ error: 'Failed to retrieve items for user' });
        }
      })
      .post(async (req, res) => {
        try {

          // to check:
          // - bidder owns item
          // - price is lower than current bid
          // - request status is active
          // const request = await new Request().select('bids?.*', '*')
          //   .where({ requestId: req.body.requestId, status: 'active', userId: [req.session!.userId, '<>'] }).limit(1).lock();
          // console.log(new Request()
          //   .select(['bids?.id', 'bidId'], 'bids?.priceCent', '*')
          //   .where({ id: req.body.requestId, status: 'active', userId: [req.session!.userId, '<>'], 'bids?.isActive': true })
          //   .order([['bids?.id', 'DESC']]).limit(1)
          //   .do());
          // const request = await new Request()
          //   .select(['bids?.id', 'bidId'], 'bids?.priceCent', '*')
          //   .where({ id: req.body.requestId, status: 'active', userId: [req.session!.userId, '<>'] })
          //   .order([['bids?.id', 'DESC']]).limit(1).run(this.db.query);
          // console.log(request);

          console.log(new Request()
            .select(['currentBids?.id', 'bidId'], 'currentBids?.priceCent', '*')
            .where({ id: req.body.requestId, requestStatus: 'active', userId: [req.session!.userId, '<>'] })
            .limit(1)
            .do());

          const request = await new Request()
            .select(['currentBids?.id', 'bidId'], 'currentBids?.priceCent', '*')
            .where({ id: req.body.requestId, requestStatus: 'active', userId: [req.session!.userId, '<>'] })
            .run(this.db.query);
          console.log(request);

          const bid = await this.create(req.body);

          // set bidder's prior bids on requests to inactive
          // await this.model.update({ isActive: false })
          //   .where({ requestId: req.body.requestId, itemId: req.body.itemId, isActive: true }).run(this.db.query);

          // send update through socket
          const updatedRequest = await new Request().findSafe(bid.requestId).run(this.db.query);
          this.socket.broadcastToQueue('get-requests', updatedRequest, { eventKey: String(bid.requestId) });
          res.json(bid);

        } catch (err) {
          console.log(err);
          res.status(404).json({ error: 'Failed to save item' });
        }
      });
  }

  // getAllByUser(id: number, includeItem: false): Promise<Partial<BidInterface>[]>;
  // getAllByUser(id: number, includeItem?: true): Promise<Partial<ItemInterface & BidInterface>[]>;
  // getAllByUser(id: number, includeItem: boolean): Promise<Partial<ItemInterface & BidInterface>[]>;
  // public async getAllByUser(id: number, includeItem = true) {
  //   const bids: (Partial<ItemInterface & BidInterface>)[] = await this.model.findByUser(id, includeItem).run(this.db.query);
  //   return bids.map(
  //     (bid: Partial<ItemInterface & BidInterface>): Partial<ItemInterface & BidInterface> => {
  //       return this.parseBid(bid, includeItem);
  //     },
  //   );
  // }

  public async create(input: Partial<ItemInterface & BidInterface>) {
    const bid: BidInterface = await this.db.transaction(
      async (query): Promise<Partial<BidInterface>> => {
        const bid: BidInterface = await this.model.create(input).run(query);

        // check that bid has been created
        if (!bid) throw Error('No record created');

        // update current bid in request
        await new Request()
          .update({ currentBidId: bid.id })
          .where({ id: bid.requestId })
          .run(query);

        return bid;
      },
    );

    // fetch bid including item
    return await this.model.findSafe(bid.id).run(this.db.query);
  }

  // parseBid(bid: Partial<ItemInterface & BidInterface>, includeItem: false): Partial<BidInterface>;
  // parseBid(bid: Partial<ItemInterface & BidInterface>, includeItem?: true): Partial<ItemInterface & BidInterface>;
  // parseBid(bid: Partial<ItemInterface & BidInterface>, includeItem: boolean): Partial<ItemInterface & BidInterface>;
  // public parseBid(bid: Partial<ItemInterface & BidInterface>, includeItem = true) {
  //   const { id, priceCent, notes } = bid;
  //   if (includeItem) {
  //     const { name, description, pictureUrl } = bid;
  //     return { id, priceCent, notes, name, description, pictureUrl };
  //   }
  //   return { id, priceCent, notes };
  // }
}
