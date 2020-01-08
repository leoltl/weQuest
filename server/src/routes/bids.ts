// tslint:disable: import-name
import { Router } from 'express';
import DB from '../lib/db';
import { accessControl } from '../lib/utils';
import { Request } from '../models/mocks';
import Bid, { BidInterface } from '../models/bid';
import { ItemInterface } from '../models/item';

export default class BidController {
  public path: string = '/api/bids';
  public router: Router = Router();
  public model = new Bid();

  constructor(public db: DB) {
    this.init();
  }

  private init() {
    // confirm that user is authenticated
    this.router.use(accessControl);

    // declare routes
    this.router
      .route('/')
      .get(async (req, res) => {
        try {
          // const output = await this.getAllByUser(req.session!.userId);
          const output = await this.model.findByUserSafe(req.session!.userId).run(this.db.query);
          res.json(output);
        } catch (err) {
          res.status(404).json({ error: 'Failed to retrieve items for user' });
        }
      })
      .post(async (req, res) => {
        try {
          const output = await this.create(req.body);
          res.json(output);
        } catch (err) {
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
    const bid: BidInterface = await this.db.transaction(async (query): Promise<Partial<BidInterface>> => {
      const bid: BidInterface = await this.model.create(input).run(query);

      // check that bid has been created
      if (!bid) throw Error('No record created');

      // update current bid in request
      (new Request()).update({ currentBidId: bid.id }).where({ id: bid.requestId }).run(query);

      return bid;
    });

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
