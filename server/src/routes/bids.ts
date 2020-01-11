// tslint:disable: import-name
import { Router } from 'express';
import DB from '../lib/db';
import Socket from '../lib/socket';
import { accessControl } from '../lib/utils';
import Request from '../models/request';
import Bid, { BidInterface } from '../models/bid';
import Item, { ItemInterface } from '../models/item';

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
          const isActive: boolean = req.query.completed || true;

          const bids = await this.model.findByUserSafe(req.session!.userId, isActive).run(this.db.query);

          // subscribe to updates for all retrieved bids
          bids.forEach((bid: Partial<BidInterface>) => {
            this.socket.subscribe(req.sessionId!, 'getBids', String(bid.id));
          });

          res.json(bids);

        } catch (err) {
          console.log(err);
          res.status(404).json({ error: 'Failed to retrieve items for user' });
        }
      })
      .post(async (req, res) => {
        try {
          // create and return a safe bid
          const bid = await this.create(req.body, req.session!.userId);

          // send updates to request through socket
          const updatedRequest = await new Request().findSafe(bid.requestId!).limit(1).run(this.db.query);
          this.socket.broadcast('getRequests', updatedRequest, { eventKey: String(bid.requestId) });

          // send updates to past bid through socket
          const pastBid = await this.model.
            select('items.name', 'items.description', 'items.pictureUrl', 'id', 'priceCent', 'notes', 'requestId', 'isActive')
            .where({ requestId: bid.requestId, 'items.userId': req.session!.userId, isActive: false })
            .order([['id', 'DESC']])
            .limit(1)
            .run(this.db.query);
          this.socket.broadcast('getBids', pastBid, { eventKey: String(bid.id) });

          // respond with safe bid
          res.json(bid);

        } catch (err) {
          res.status(404).json({ error: 'Failed to save item' });
        }
      });
  }

  public async create(input: Partial<ItemInterface & BidInterface>, userId: number): Promise<Partial<ItemInterface & BidInterface>> {

    // fetch request
    const request = await new Request()
      .select()
      .where({
        id: input.requestId,
        requestStatus: 'active',
        userId: [userId, '<>'],
        'currentBids?.priceCent': [input.priceCent, '>'],
      })
      .run(this.db.query);

    // throw an error if no valid request can be found (e.g. request does not exist,
    // bidder and requester are the same, price is greater than or equal to current bid price, request is inactive...)
    if (!request) throw Error('Invalid bid');

    // fetch user item
    const item = await new Item().select().where({ userId, id: input.itemId });

    // throw if item cannot be found based on itemId and userId (e.g. item does not exist or is not owned by the bidder)
    if (!item) throw Error('Invalid bid');

    // proceed with creating the bid
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

        // update bidder's prior bid for request/item combo (only only active bid per product allowed)
        await this.model
          .update({ isActive: false })
          .where({ itemId: bid.itemId, id: [bid.id, '<>'] })
          .run(query);

        return bid;
      },
    );

    // fetch bid including item
    return await this.model.findSafe(bid.id).run(this.db.query);
  }
}
