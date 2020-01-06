// tslint:disable-next-line: import-name
import Model from '../lib/model';
// tslint:disable-next-line: import-name
import SQL, { and, or } from '../lib/sql';
import User from './user';
import Bid from './bid';
// tslint:disable-next-line: import-name

export class Request extends Model {
  protected init() {
    this.alias = 'requests';
    this.table = 'requests';

    this.columns = {
      id: { name: 'id', type: Number.isInteger, primaryKey: true },
      description: { name: 'description', type: 'string', required: true },
      auctionStart: {
        name: 'auction_start',
        type: Number.isInteger,
        required: true,
      },
      auctionEnd: {
        name: 'auction_end',
        type: Number.isInteger,
        required: true,
      },
      borrowStart: {
        name: 'borrow_start',
        type: Number.isInteger,
        required: true,
      },
      borrowEnd: { name: 'borrow_end', type: Number.isInteger, required: true },
      isActive: { name: 'is_active', type: 'boolean', required: false },
      userId: { name: 'user_id', type: Number.isInteger, required: true },
      winningBid: {
        name: 'winning_bid_id',
        type: Number.isInteger,
        required: false,
      },
      currentBid: {
        name: 'current_bid_id',
        type: Number.isInteger,
        required: false,
      },
    };

    this.joins = {
      users: {
        joinColumn: 'userId',
        foreignJoinColumn: 'id',
        foreignModel: User,
      },
      bids: {
        joinColumn: 'id',
        foreignJoinColumn: 'requestId',
        foreignModel: Bid,
      }, //missing in schema
    };
  }

  // public async findForRequestFeed() {
  //   this.manual(
  //     `SELECT requests.id, requests.user_id, requests.description, requests.current_bid_id, users.name, users.email, bids.price_cent, bids.item_id
  //   FROM requests LEFT JOIN users ON requests.user_id = users.id
  //   LEFT JOIN bids on requests.current_bid_id = bids.id
  //   ORDER BY requests.id
  //   LIMIT 20`,
  //   ).run(db.query);
  // }
}
