// tslint:disable-next-line: import-name
import Model from '../lib/model';
// tslint:disable-next-line: import-name
import Bid from './bid';

export class User extends Model {
  init() {
    this.table = 'users';

    this.columns = {
      id: { name: 'id', type: Number.isInteger, primaryKey: true },
      name: { name: 'name', type: 'string', required: true },
      email: { name: 'email', type: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test, required: true },
      password: { name: 'password_digest', type: 'string', required: true },
      postalCode: { name: 'postal_code', type: 'string', required: false },
      latitude: { name: 'latitude', type: 'number', required: false },
      longitude: { name: 'longitude', type: 'number', required: false },
    };

    this.joins = {
      requests: { joinColumn: 'id', foreignJoinColumn: 'userId', foreignModel: Request },
      bids: { joinColumn: 'id', foreignJoinColumn: 'userId', foreignModel: Bid },
    };
  }
}

export class Request extends Model {
  init() {
    this.table = 'requests';

    this.columns = {
      id: { name: 'id', type: Number.isInteger, required: true },
      description: { name: 'description', type: 'string', required: true },
      auctionStart: { name: 'auction_start', type: 'number', required: true },
      auctionEnd: { name: 'auction_end', type: 'number', required: true },
      borrowStart: { name: 'borrow_start', type: 'number', required: true },
      borrowEnd: { name: 'borrow_end', type: 'number', required: true },
      isActive: { name: 'is_active', type: 'boolean', required: true },
      userId: { name: 'user_id', type: Number.isInteger, required: true },
      winningBid: { name: 'winning_bid_id', type: Number.isInteger, required: false },
      currentBid: { name: 'current_bid_id', type: Number.isInteger, required: false },
    };

    this.joins = {
      users: { joinColumn: 'userId', foreignJoinColumn: 'id', foreignModel: User },
      bids: { joinColumn: 'id', foreignJoinColumn: 'requestId', foreignModel: Bid },
    };
  }
}
