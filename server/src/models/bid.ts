// tslint:disable: import-name
// prettier-ignore
import Model from '../lib/model';
import SQL, { and, or } from '../lib/sql';
import User from './user';
import Request from './request';
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
      createdAt: { name: 'created_at', type: Number.isInteger, required: false },
      isActive: { name: 'is_active', type: 'boolean', required: false },
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

  public findSafe(id: number, isActive?: boolean, includeItem = true): SQL {
    return includeItem
      ? this.select('items.name', 'items.description', 'items.pictureUrl', 'id', 'priceCent', 'notes', 'requestId', 'isActive')
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

  public findByUserSafe(userId: number, isActive?: boolean, includeItem = true): SQL {
    return includeItem
      ? this.sql(
        `SELECT
        bids.id, bids.price_cent, bids.notes, bids.is_active,
        items.name, items.description, items.picture_url,
        requests.current_bid_id, requests.title AS request_title, requests.description AS request_description,
        current_bid.price_cent AS current_bid_price
        FROM bids
        JOIN items ON bids.item_id = items.id
        JOIN requests ON bids.request_id = requests.id
        JOIN bids AS current_bid ON requests.current_bid_id = current_bid.id
        WHERE items.user_id = $1 AND bids.is_active = $2
        ORDER BY bids.id DESC
        `,
        [userId, isActive],
      )
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
    return this.select('items.name', 'items.description', 'items.pictureUrl', 'id', 'priceCent', 'notes', 'requestId', 'isActive', ['items.users.name', 'username'], 'priceCent')
      .where({ requestId, 'requests.userId': userId })
      .order([['id', 'DESC']]);
  }

  public findByActivityRequestSafe(requestId: number): SQL {
    return this.sql(
      `SELECT
      bids.id, bids.price_cent, bids.notes, bids.is_active,
      items.name, items.description, items.picture_url,
      requests.current_bid_id, requests.title AS request_title, requests.description AS request_description,
      current_bid.price_cent AS current_bid_price
      FROM bids
      JOIN items ON bids.item_id = items.id
      JOIN requests ON bids.request_id = requests.id
      JOIN bids AS current_bid ON requests.current_bid_id = current_bid.id
      WHERE bids.request_id = $1
      ORDER BY bids.id DESC
      `,
      [requestId],
    );
  }
}
