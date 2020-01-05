// tslint:disable-next-line: import-name
import Model from '../lib/model';
// tslint:disable-next-line: import-name
import SQL, { and, or } from '../lib/sql';
import { User, Request } from './mocks';
// tslint:disable-next-line: import-name
import Item from './item';

export default class Bid extends Model {
  protected init() {
    this.alias = 'bids';
    this.table = 'bids';

    this.columns = {
      id: { name: 'id', type: Number.isInteger, primaryKey: true },
      price: { name: 'price_cents', type: Number.isInteger, required: true },
      notes: { name: 'notes', type: 'string', required: true }, //missing in schema
      userId: { name: 'user_id', type: Number.isInteger, required: true },
      requestId: { name: 'request_id', type: Number.isInteger, required: true }, //missing in schema
      itemId: { name: 'item_id', type: Number.isInteger, required: true },
    };

    this.joins = {
      users: { joinColumn: 'userId', foreignJoinColumn: 'id', foreignModel: User },
      requests: { joinColumn: 'requestId', foreignJoinColumn: 'id', foreignModel: Request }, //missing in schema
      items: { joinColumn: 'itemId', foreignJoinColumn: 'id', foreignModel: Item },
    };
  }

  public find(id: number, includeItem = true): SQL {
    return includeItem ?
      this.select('*', 'items.*').where({ id }).limit(1) :
      this.select().where({ id }).limit(1);
  }

  public findByUser(userId: number, includeItem = true): SQL {
    return includeItem ?
      this.select('*', 'items.*').where({ userId }).order([['id', 'DESC']]) :
      this.select().where({ userId }).order([['id', 'DESC']]);
  }

  public findByRequest(requestId: number, includeItem = true): SQL {
    return includeItem ?
      this.select('*', 'items.*').where({ requestId }).order([['id', 'DESC']]) :
      this.select().where({ requestId }).order([['id', 'DESC']]);
  }
}

// test
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
