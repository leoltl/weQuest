// tslint:disable: import-name
import Model from '../lib/model';
import SQL, { and, or } from '../lib/sql';
import User from './user';
import { Request } from './mocks';
import Item from './item';

export interface BidInterface {
  id: number;
  priceCent: number;
  notes: string;
  createdAt: number;
  userId: number;
  requestId: number;
  itemId: number;
}

export default class Bid extends Model {
  protected init() {
    this.alias = 'bids';
    this.table = 'bids';

    this.columns = {
      id: { name: 'id', type: Number.isInteger, primaryKey: true },
      priceCent: { name: 'price_cent', type: Number.isInteger, required: true },
      notes: { name: 'notes', type: 'string', required: true },
      requestId: { name: 'request_id', type: Number.isInteger, required: true },
      itemId: { name: 'item_id', type: Number.isInteger, required: true },
      createdAt: { name: 'created_at', type: Number.isInteger, required: false },
    };

    this.joins = {
      requests: { joinColumn: 'requestId', foreignJoinColumn: 'id', foreignModel: Request },
      items: { joinColumn: 'itemId', foreignJoinColumn: 'id', foreignModel: Item },
    };
  }

  public find(id: number, includeItem = true): SQL {
    return includeItem ?
      this.select('items.*', '*').where({ id }).limit(1) :
      this.select().where({ id }).limit(1);
  }

  public findSafe(id: number, includeItem = true): SQL {
    return includeItem ?
      this.select('items.name', 'items.description', 'items.pictureUrl', 'id', 'priceCent', 'notes').where({ id }).limit(1) :
      this.select('id', 'priceCent', 'notes').where({ id }).limit(1);
  }

  public findByUser(userId: number, includeItem = true): SQL {
    return includeItem ?
      this.select('items.*', '*').where({ 'items.userId': userId }).order([['id', 'DESC']]) :
      this.select().where({ userId }).order([['id', 'DESC']]);
  }

  public findByUserSafe(userId: number, includeItem = true): SQL {
    return includeItem ?
      this.select(
        'items.name', 'items.description', 'items.pictureUrl', 'id', 'priceCent', 'notes',
      ).where({ 'items.userId': userId }).order([['id', 'DESC']]) :
      this.select('id', 'priceCent', 'notes').where({ userId }).order([['id', 'DESC']]);
  }

  public findByRequest(requestId: number, includeItem = true): SQL {
    return includeItem ?
      this.select('items.*', '*').where({ requestId }).order([['id', 'DESC']]) :
      this.select().where({ requestId }).order([['id', 'DESC']]);
  }
}
