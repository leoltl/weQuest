// tslint:disable-next-line: import-name
import Model, { ColumnInput } from '../lib/model';
import { isDate } from '../lib/utils';
// tslint:disable-next-line: import-name

import SQLQuery from '../lib/sql';

import User from './user';
import Bid from './bid';
// tslint:disable-next-line: import-name

export class Request extends Model {
  protected init() {
    this.alias = 'requests';
    this.table = 'requests';

    this.columns = {
      id: { name: 'id', type: Number.isInteger, primaryKey: true },
      description: { name: 'description', type: 'string', required: false },
      auctionStart: {
        name: 'auction_start',
        type: 'string',
        required: true,
      },
      auctionEnd: {
        name: 'auction_end',
        type: 'string',
        required: true,
      },
      borrowStart: {
        name: 'borrow_start',
        type: 'string',
        required: true,
      },
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
      title: {
        name: 'title',
        type: 'string',
        required: true,
      },
      request_status: {
        name: 'request_status',
        type: 'string',
      },
    };

    this.joins = {
      users: {
        joinColumn: 'userId',
        foreignJoinColumn: 'id',
        foreignModel: User,
      },
      bids: {
        joinColumn: 'id',
        foreignJoinColumn: 'requestId',
        foreignModel: Bid,
      }, //missing in schema
    };
  }

  public create(input: ColumnInput): SQLQuery {
    return this.insert(
      input,
      new WeakMap([[this, this.requiredColumns.concat('description')]]),
    );
  }
}
