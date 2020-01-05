// tslint:disable-next-line: import-name
import Model from '../lib/model';
// tslint:disable-next-line: import-name
import SQL, { and, or } from '../lib/sql';
import { User, Request } from './mocks';

export default class Bid extends Model {
  init() {
    this.table = 'bids';

    this.columns = {
      id: { name: 'id', type: Number.isInteger, primaryKey: true },
      price: { name: 'price_cents', type: Number.isInteger, required: true },
      userId: { name: 'user_id', type: Number.isInteger, required: true },
      requestId: { name: 'request_id', type: Number.isInteger, required: true },
    };

    this.joins = {
      users: { joinColumn: 'userId', foreignJoinColumn: 'id', foreignModel: User },
      requests: { joinColumn: 'requestId', foreignJoinColumn: 'id', foreignModel: Request },
    };
  }
}

const users = new User();
const requests = new Request;
const bids = new Bid;

const query = users.select('name');

query.where({
  relation: 'OR',
  conditions: [
    { name: 'hey' },
    { email: 'hey' },
    { ['requests.date']: 'hey' },
    {
      relation: 'AND',
      conditions: [
        { name: 'hey' },
        { email: 'hey' },
        { ['requests.date']: 'hey' },
      ],
    },
  ],
});

console.log(query);

const query2 = users.select('name', 'bids.price');

query2.where(or(and({ id: 2, ['requests.id']: 4 }), { name: 'John Doe' }));

console.log(query2);
console.log(query2.do());

console.log(users.select().do());
console.log(users.find(4).do());

console.log(users.update({ name: 'Jane Smith' }).where({ id: 2 }).do());
