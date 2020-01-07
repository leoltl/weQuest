// tslint:disable-next-line: import-name
import Model from '../lib/model';
// tslint:disable-next-line: import-name
import Bid from './bid';
// tslint:disable-next-line: import-name
import Item from './item';

export class User extends Model {
  protected init() {
    this.alias = 'users';
    this.table = 'users';

    this.columns = {
      id: { name: 'id', type: Number.isInteger, primaryKey: true },
      name: { name: 'name', type: 'string', required: true },
      email: { name: 'email', type: RegExp.prototype.test.bind(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/), required: true },
      password: { name: 'password_digest', type: 'string', required: true },
      postalCode: { name: 'postal_code', type: 'string', required: false },
      latitude: { name: 'latitude', type: 'number', required: false },
      longitude: { name: 'longitude', type: 'number', required: false },
    };

    this.joins = {
      requests: { joinColumn: 'id', foreignJoinColumn: 'userId', foreignModel: Request },
      bids: { joinColumn: 'id', foreignJoinColumn: 'userId', foreignModel: Bid },
      items: { joinColumn: 'id', foreignJoinColumn: 'userId', foreignModel: Item },
    };
  }
}

export class Request extends Model {
  protected init() {
    this.alias = 'requests';
    this.table = 'requests';

    this.columns = {
      id: { name: 'id', type: Number.isInteger, required: true },
      title: { name: 'title', type: 'string', required: true },
      description: { name: 'description', type: 'string', required: false },
      auctionStart: { name: 'auction_start', type: Number.isInteger, required: true },
      auctionEnd: { name: 'auction_end', type: Number.isInteger, required: true },
      borrowStart: { name: 'borrow_start', type: Number.isInteger, required: true },
      borrowEnd: { name: 'borrow_end', type: Number.isInteger, required: true },
      isActive: { name: 'is_active', type: 'boolean', required: true },
      userId: { name: 'user_id', type: Number.isInteger, required: true },
      winningBidId: { name: 'winning_bid_id', type: Number.isInteger, required: false },
      currentBidId: { name: 'current_bid_id', type: Number.isInteger, required: false },
    };

    this.safeColumns = ['description', 'winningBidId', 'currentBidId'];

    this.joins = {
      users: { joinColumn: 'userId', foreignJoinColumn: 'id', foreignModel: User },
      bids: { joinColumn: 'id', foreignJoinColumn: 'requestId', foreignModel: Bid }, //missing in schema
    };
  }
}

// test
// const users = new User();
// const requests = new Request;
// const bids = new Bid;

// const query = users.select('name');

// query.where({
//   relation: 'OR',
//   conditions: [
//     { name: 'hey' },
//     { email: 'hey@hello.ca' },
//     { ['requests.isActive']: true },
//     {
//       relation: 'AND',
//       conditions: [
//         { name: 'hey' },
//         { email: 'hey@hello.ca' },
//         { ['requests.isActive']: true },
//       ],
//     },
//   ],
// });

// console.log(query);

// const query2 = users.select('name', 'bids.price');

// query2.where(or(and({ id: 2, ['requests.id']: 4 }), { name: 'John Doe' }));

// console.log(query2);
// console.log(query2.do());

// console.log(users.select().do());
// console.log(users.find(4).do());

// console.log(users.update({ name: 'Jane Smith' }).where({ id: 2 }).do());