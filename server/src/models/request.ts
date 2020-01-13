// tslint:disable: import-name
import Model, { ColumnInput } from '../lib/model';
import SQL from '../lib/sql';
import User from './user';
import Bid from './bid';

export interface RequestInterface {
  id: number;
  title: string;
  description: string;
  budgetCent: number;
  auctionStart: string;
  auctionEnd: string;
  borrowStart: string;
  borrowEnd: string;
  isActive: boolean;
  userId: number;
  winningBidId: number;
  currentBidId: NumberConstructor;
  requestStatus: RequestStatus;
}

export type RequestStatus = 'deactivated' | 'active' | 'pending decision' | 'winner selected' | 'closed';

export default class Request extends Model {
  protected init() {
    this.alias = 'requests';
    this.table = 'requests';

    this.columns = {
      id: { name: 'id', type: Number.isInteger, primaryKey: true },
      title: { name: 'title', type: 'string', required: true },
      description: { name: 'description', type: 'string', required: false },
      budgetCent: { name: 'budget_cent', type: Number.isInteger, required: true },
      auctionStart: { name: 'auction_start', type: 'string', required: true },
      auctionEnd: { name: 'auction_end', type: 'string', required: true },
      borrowStart: { name: 'borrow_start', type: 'string', required: true },
      borrowEnd: { name: 'borrow_end', type: 'string', required: true },
      isActive: { name: 'is_active', type: 'boolean', required: true },
      userId: { name: 'user_id', type: Number.isInteger, required: true },
      winningBidId: { name: 'winning_bid_id', type: Number.isInteger, required: false },
      currentBidId: { name: 'current_bid_id', type: Number.isInteger, required: false },
      requestStatus: {
        name: 'request_status',
        type: val => ['deactivated', 'active', 'pending decision', 'winner selected', 'closed'].includes(val),
      },
    };

    this.safeColumns = ['description', 'winningBidId', 'currentBidId', 'requestStatus'];

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
      },
      currentBids: {
        joinColumn: 'currentBidId',
        foreignJoinColumn: 'id',
        foreignModel: Bid,
      },
    };

  }

  public create(input: ColumnInput): SQL {
    return this.insert(
      input,
      new WeakMap([[this, this.requiredColumns.concat('description')]]),
    );
  }

  public findSafe(id?: number, status?: RequestStatus, excludeUsers?: number[]): SQL {
    const query = this.sql(
      `SELECT requests.id, requests.title, requests.auction_end, requests.description, requests.current_bid_id, requests.request_status, users.name, COALESCE(bids.price_cent, requests.budget_cent) as price_cent, bids.item_id
      FROM requests
      JOIN users ON requests.user_id = users.id
      LEFT JOIN bids on requests.current_bid_id = bids.id
      ${id !== undefined
        ? `WHERE requests.id = $1
          ${status
            && ` AND requests.request_status = $2${excludeUsers !== undefined && ' AND requests.user_id <> ANY($3)' || ''}`
            || excludeUsers !== undefined && ' AND requests.user_id <> ANY($2)' || ''}
          ORDER BY requests.id DESC
          LIMIT 20`
        : status
          && ` WHERE requests.request_status = $1${excludeUsers !== undefined && ' AND requests.user_id <> ANY($2)' || ''}`
          || excludeUsers !== undefined && ' WHERE requests.user_id <> ANY($1)' || ''}`,
      id !== undefined
        ? status
          && (excludeUsers !== undefined && [id, status, excludeUsers] || [id, status])
          || (excludeUsers !== undefined && [id, excludeUsers] || [id])
        : status
          && (excludeUsers !== undefined && [status, excludeUsers] || [status])
          || (excludeUsers !== undefined && [excludeUsers] || undefined),
    );

    return id !== undefined ? query.limit(1) : query;
  }

  public findSafeByUserId(userId: number, status?: RequestStatus): SQL {
    return this.sql(
      `SELECT requests.id, requests.title, requests.auction_end, requests.description, requests.current_bid_id, requests.request_status, users.name, COALESCE(bids.price_cent, requests.budget_cent) as price_cent, bids.item_id
      FROM requests
      JOIN users ON requests.user_id = users.id
      LEFT JOIN bids on requests.current_bid_id = bids.id
      WHERE requests.user_id = $1 ${status && ' AND requests.request_status = $2' || ''}
      ORDER BY requests.id DESC
      LIMIT 20`,
      status && [userId, status] || [userId],
    );
  }

  public findSafeByQuery(query: string, userId: number): SQL {
    return this.sql(
      `SELECT requests.id, requests.title, requests.auction_end, requests.description, requests.current_bid_id, requests.request_status, users.name, COALESCE(bids.price_cent, requests.budget_cent) as price_cent, bids.item_id
      FROM requests
      LEFT JOIN users ON requests.user_id = users.id
      LEFT JOIN bids on requests.current_bid_id = bids.id
      WHERE (requests.title ILIKE $1 OR requests.title ILIKE $2 OR requests.title ILIKE $3)
      AND request.request_status = 'active' AND request.user_id <> $4`,
      [`${query}%`, `%${query}`, `%${query}%`, userId],
    );
  }

  public findRequestById(id: number): SQL {
    return this.find(id);
  }

  public findAllActiveRequest(excludeUsers?: number[]): SQL {
    // not working as intended ? > can still see completed request on request feed
    return this.findSafe(undefined, 'active', excludeUsers);
  }

  public findBidsByRequestId(id: number): SQL {
    return this.select('*', 'bids.*').where({ id });
  }
}
