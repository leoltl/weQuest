// tslint:disable: import-name
import Model from '../lib/model';
import SQL, { and, or } from '../lib/sql';
import User from './user';
import Bid from './bid';

export interface ItemInterface {
  id: number;
  name: string;
  description: string;
  pictureUrl: string;
  userId: number;
}

export default class Item extends Model {
  protected init() {
    this.alias = 'items';
    this.table = 'items';

    this.columns = {
      id: { name: 'id', type: Number.isInteger, primaryKey: true },
      name: { name: 'name', type: 'string', required: true },
      description: { name: 'description', type: 'string', required: true },
      pictureUrl: { name: 'picture_url', type: RegExp.prototype.test.bind(/^https?:\/\//), required: true },
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
