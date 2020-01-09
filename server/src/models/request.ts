// tslint:disable-next-line: import-name
import Model, { ColumnInput } from '../lib/model';
import { isDate } from '../lib/utils';
// tslint:disable-next-line: import-name

import SQLQuery from '../lib/sql';

import user from './user';
import bid from './bid';
// tslint:disable-next-line: import-name

export class Request extends Model {
  protected init() {
    this.alias = 'requests';
    this.table = 'requests';

    this.columns = {
      id: { name: 'id', type: Number.isInteger, primaryKey: true },
      description: { name: 'description', type: 'string', required: false },
      auctionStart: { name: 'auction_start', type: 'string', required: true },
      auctionEnd: { name: 'auction_end', type: 'string', required: true },
      borrowStart: { name: 'borrow_start', type: 'string', required: true },
      borrowEnd: { name: 'borrow_end', type: 'string', required: true },
      isActive: { name: 'is_active', type: 'boolean', required: true },
      userId: { name: 'user_id', type: Number.isInteger, required: true },
      winningBidId: {
        name: 'winning_bid_id',
        type: Number.isInteger,
        required: false,
      },
      currentBidId: {
        name: 'current_bid_id',
        type: Number.isInteger,
        required: false,
      },
      title: { name: 'title', type: 'string', required: true },
      status: {
        name: 'request_status',
        type: 'string',
      },
      budgetCent: {
        name: 'budget_cent',
        type: Number.isInteger,
        required: true,
      },
    };

    this.joins = {
      users: {
        joinColumn: 'userId',
        foreignJoinColumn: 'id',
        foreignModel: user,
      },
      bids: {
        joinColumn: 'id',
        foreignJoinColumn: 'requestId',
        foreignModel: bid,
      }, // missing in schema
    };

    this.safeColumns = [
      'description',
      'winningBidId',
      'currentBidId',
      'status',
    ];
  }

  public create(input: ColumnInput): SQLQuery {
    return this.insert(
      input,
      new WeakMap([[this, this.requiredColumns.concat('description')]]),
    );
  }

  public findAllRequest() {
    return this.sql(
      `SELECT requests.id, requests.title, requests.auction_end, requests.user_id, requests.description, requests.current_bid_id, users.name, users.email, COALESCE(bids.price_cent, requests.budget_cent) as price_cent, bids.item_id
        FROM requests LEFT JOIN users ON requests.user_id = users.id
        LEFT JOIN bids on requests.current_bid_id = bids.id
        ORDER BY requests.id DESC
        LIMIT 20`,
    );
  }

  public findRequestById(id: number): SQLQuery {
    return this.find(id);
  }

  public findBidsByRequestId(id: number): SQLQuery {
    return this.select('*', 'bids.*').where({ id });
  }

  public findRequestsByStatus(userId: number, status: string): SQLQuery {
    return this.sql(
      `SELECT requests.id, requests.title, requests.auction_end, requests.user_id, requests.description, requests.current_bid_id, users.name, users.email, COALESCE(bids.price_cent, requests.budget) as price_cent, bids.item_id
        FROM requests LEFT JOIN users ON requests.user_id = users.id
        LEFT JOIN bids on requests.current_bid_id = bids.id
        WHERE user_id = $1 AND requests.request_status = $2
        ORDER BY requests.id DESC
        LIMIT 10`,
      [userId, status],
    );
  }
}
