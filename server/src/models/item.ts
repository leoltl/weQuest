// tslint:disable-next-line: import-name
import Model from '../lib/model';
// tslint:disable-next-line: import-name
import SQL, { and, or } from '../lib/sql';
import { User } from './mocks';
// tslint:disable-next-line: import-name
import Bid from './bid';

export default class Item extends Model {
  protected init() {
    this.alias = 'items';
    this.table = 'items';

    this.columns = {
      id: { name: 'id', type: Number.isInteger, primaryKey: true },
      name: { name: 'name', type: 'string', required: true },
      description: { name: 'description', type: 'string', required: true },
      pictureUrl: { name: 'picture_url', type: /^https?:\/\//.test, required: true },
      userId: { name: 'user_id', type: Number.isInteger, required: true },
    };

    this.joins = {
      users: { joinColumn: 'userId', foreignJoinColumn: 'id', foreignModel: User },
      bids: { joinColumn: 'id', foreignJoinColumn: 'itemId', foreignModel: Bid },
    };
  }

  public findByUser(userId: number): SQL {
    return this.select().where({ userId }).order([['id', 'DESC']]);
  }

  public findByBid(bidId: number): SQL {
    return this.select().where({ 'bids.id': bidId }).order([['id', 'DESC']]);
  }
}
