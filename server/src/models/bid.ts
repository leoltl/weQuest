// tslint:disable: import-name
// prettier-ignore
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
  isActive: boolean;
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
      createdAt: {
        name: 'created_at',
        type: Number.isInteger,
        required: false,
      },
      isActive: { name: 'is_active', type: 'boolean' },
    };

    this.safeColumns = ['isActive'];

    this.joins = {
      requests: {
        joinColumn: 'requestId',
        foreignJoinColumn: 'id',
        foreignModel: Request,
      },
      items: {
        joinColumn: 'itemId',
        foreignJoinColumn: 'id',
        foreignModel: Item,
      },
    };
  }

  public find(id: number, includeItem = true): SQL {
    return includeItem
      ? this.select('items.*', '*')
          .where({ id })
          .limit(1)
      : this.select()
          .where({ id })
          .limit(1);
  }

  public findSafe(id: number, includeItem = true): SQL {
    return includeItem
      ? this.select(
          'items.name',
          'items.description',
          'items.pictureUrl',
          'id',
          'priceCent',
          'notes',
          'requestId',
        )
          .where({ id })
          .limit(1)
      : this.select('id', 'priceCent', 'notes')
          .where({ id })
          .limit(1);
  }

  public findByUser(userId: number, includeItem = true): SQL {
    return includeItem
      ? this.select('items.*', '*')
          .where({ 'items.userId': userId })
          .order([['id', 'DESC']])
      : this.select()
          .where({ userId })
          .order([['id', 'DESC']]);
  }

  public findByUserSafe(
    userId: number,
    active = true,
    includeItem = true,
  ): SQL {
    return includeItem
      ? this.select(
          'items.name',
          'items.description',
          'items.pictureUrl',
          'id',
          'priceCent',
          'notes',
        )
          .where({ 'items.userId': userId, isActive: active })
          .order([['id', 'DESC']])
      : this.select('id', 'priceCent', 'notes')
          .where({ userId })
          .order([['id', 'DESC']]);
  }

  public findByRequest(requestId: number, includeItem = true): SQL {
    return includeItem
      ? this.select('items.*', '*')
          .where({ requestId })
          .order([['id', 'DESC']])
      : this.select()
          .where({ requestId })
          .order([['id', 'DESC']]);
  }

  public findByRequestSafe(requestId: number, userId: number): SQL {
    return this.sql(
      `SELECT bids.id, bids.price_cent, bids.notes, bids.request_id, items.name, items.description, items.picture_url, users.name as username
      FROM bids
      JOIN items ON bids.item_id = items.id
      JOIN requests ON bids.request_id = requests.id
      JOIN users ON items.user_id = users.id
      WHERE requests.id = $1 AND requests.user_id = $2
      ORDER BY bids.id DESC`,
      [requestId, userId],
    );
  }
}
