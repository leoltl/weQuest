// tslint:disable: import-name
import { Router } from 'express';
import DB from '../lib/db';
import { and, or } from '../lib/sql';
import Socket from '../lib/socket';
import { accessControl, notifyUser } from '../lib/utils';
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
          // req.query is a string. convert a string to boolean so it passes validator with correct type
          const completed: boolean = (req.query.completed === 'true');
          const isActive: boolean = !completed;

          const bids = await this.model.findByUserSafe(req.session!.userId, isActive).run(this.db.query);

          // subscribe to updates for all retrieved bids
          bids.forEach((bid: Partial<BidInterface>) => {
            this.socket.subscribe(req.sessionId!, 'get-bids', String(bid.id));
          });

          res.json(bids);

        } catch (err) {
          res.status(500).json({ error: 'Failed to retrieve items for user' });
        }
      })
      .post(async (req, res) => {
        try {
          // validate request and item
          const [requesterId, lastBidId, lastBidUserId] = await this.validateCreate(req.body, req.session!.userId);

          // create and return a safe bid
          const bid = await this.create(req.body, req.session!.userId);

          // send updates to request through socket
          const updatedRequest = await new Request().findSafe(bid.requestId!).limit(1).run(this.db.query);
          this.socket.broadcast('get-requests', updatedRequest, { eventKey: String(bid.requestId) });

          // send updates to past bid through socket
          const pastBids = await this.model.findByActivityRequestSafe(bid.requestId!).run(this.db.query);
          pastBids.length && this.socket.broadcast('get-bids', pastBids, { eventKey: String(bid.id) });

          // subscribe user for updates to new bid
          this.socket.subscribe(req.sessionId!, 'get-bids', String(bid.id));

          // send notification to requester
          notifyUser(requesterId, `A new bid has been placed on your request: ${updatedRequest.title}.`, this.socket);

          // send notification to past bid if from different bidder
          lastBidUserId !== req.session!.userId && notifyUser(lastBidUserId, `Your bid for ${updatedRequest.title} has been overtaken. Not all hope is lost though. The requester might still accept it. When in doubt... bid again!`, this.socket);

          // respond with safe bid
          res.json(bid);

        } catch (err) {
          res.status(500).json({ error: 'Failed to save item' });
        }
      });
  }

  // validates that item and request in input are valid
  public async validateCreate(input: Partial<ItemInterface & BidInterface>, userId: number): Promise<[number, number, number]> {

    // fetch request
    const request = await new Request()
      .sql(
        `SELECT requests.user_id as requester_id, requests.current_bid_id, items.user_id
        FROM requests
        LEFT JOIN bids ON requests.current_bid_id = bids.id
        LEFT JOIN items ON bids.item_id = items.id
        WHERE requests.id = $1 AND requests.request_status = $2 AND requests.user_id <> $3 AND
          (items.name IS NULL OR bids.price_cent > $4 OR
            (bids.price_cent = $4 AND bids.price_cent = $5))
        LIMIT 1
        `,
        [input.requestId, 'active', userId, input.priceCent, 0],
      )
      .limit(1)
      .run(this.db.query);

    // throw an error if no valid request can be found (e.g. request does not exist,
    // bidder and requester are the same, price is greater than or equal to current bid price (except if 0), request is inactive...)
    if (!request) throw Error('Invalid bid');

    // fetch user item
    const item = await new Item().select().where({ userId, id: input.itemId }).limit(1).run(this.db.query);

    // throw if item cannot be found based on itemId and userId (e.g. item does not exist or is not owned by the bidder)
    if (!item) throw Error('Invalid bid');

    // if validation is successful return current bid id and user id of last bidder
    return [request.requesterId, request.currentBidId, request.userId];

  }

  public async create(input: Partial<ItemInterface & BidInterface>, userId: number): Promise<Partial<ItemInterface & BidInterface>> {

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
