// tslint:disable: import-name
import { Router } from 'express';
import DB from '../lib/db';
import { accessControl } from '../lib/utils';
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
          const output = await this.getAllByUser(req.session!.userId);
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

  public async getAllByUser(id: number, includeItem: false): Promise<Partial<BidInterface>[]>;
  public async getAllByUser(id: number, includeItem?: true): Promise<Partial<ItemInterface & BidInterface>[]>;
  public async getAllByUser(id: number, includeItem: boolean): Promise<Partial<ItemInterface & BidInterface>[]>;
  public async getAllByUser(id: number, includeItem = true) {
    const bids: (Partial<ItemInterface & BidInterface>)[] = await this.model.findByUser(id, includeItem).run(this.db.query);
    return bids.map(
      (bid: Partial<ItemInterface & BidInterface>): Partial<ItemInterface & BidInterface> => {
        return this.parseBid(bid, includeItem);
      },
    );
  }

  public async create(input: Partial<ItemInterface & BidInterface>) {
    const bid: BidInterface[] = await this.model.create(input).run(this.db.query);

    // check that bid has been created
    if (!bid) throw Error('No record created');

    // fetch bid including item
    const fullBid: (ItemInterface & BidInterface)[] = await this.model.find(bid[0].id).run(this.db.query);
    // parse bid + item
    return this.parseBid(fullBid[0]);
  }

  public parseBid(bid: Partial<ItemInterface & BidInterface>, includeItem: false): Partial<BidInterface>;
  public parseBid(bid: Partial<ItemInterface & BidInterface>, includeItem?: true): Partial<ItemInterface & BidInterface>;
  public parseBid(bid: Partial<ItemInterface & BidInterface>, includeItem: boolean): Partial<ItemInterface & BidInterface>;
  public parseBid(bid: Partial<ItemInterface & BidInterface>, includeItem = true) {
    const { id, priceCent, notes } = bid;
    if (includeItem) {
      const { name, description, pictureUrl } = bid;
      return { id, priceCent, notes, name, description, pictureUrl };
    }
    return { id, priceCent, notes };
  }
}
