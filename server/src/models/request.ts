// tslint:disable: import-name
import Model, { ColumnInput } from '../lib/model';
import SQL from '../lib/sql';
import user from './user';
import bid from './bid';

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
        foreignModel: user,
      },
      bids: {
        joinColumn: 'id',
        foreignJoinColumn: 'requestId',
        foreignModel: bid,
      },
      currentBids: {
        joinColumn: 'currentBidId',
        foreignJoinColumn: 'id',
        foreignModel: bid,
      },
    };

  }

  public create(input: ColumnInput): SQL {
    return this.insert(
      input,
      new WeakMap([[this, this.requiredColumns.concat('description')]]),
    );
  }

  public findAllActiveRequest(): SQL {
    return this.sql(
      `SELECT requests.id, requests.title, requests.auction_end, requests.description, requests.current_bid_id, users.name, COALESCE(bids.price_cent, requests.budget_cent) as price_cent, bids.item_id
      FROM requests LEFT JOIN users ON requests.user_id = users.id
      LEFT JOIN bids on requests.current_bid_id = bids.id
      WHERE requests.request_status = 'active'
      ORDER BY requests.id DESC
      LIMIT 20`,
    );
  }

  public findSafe(id: number): SQL {
    return this.sql(
      `SELECT requests.id, requests.title, requests.auction_end, requests.description, requests.current_bid_id, users.name, COALESCE(bids.price_cent, requests.budget_cent) as price_cent, bids.item_id
      FROM requests LEFT JOIN users ON requests.user_id = users.id
      LEFT JOIN bids on requests.current_bid_id = bids.id
      WHERE requests.id = $1
      ORDER BY requests.id DESC
      LIMIT 20`,
      [id],
    );
  }

  public findRequestById(id: number): SQL {
    return this.find(id);
  }

  public findBidsByRequestId(id: number): SQL {
    return this.select('*', 'bids.*').where({ id });
  }

  public findRequestsByStatus(userId: number, status: string): SQL {
    return this.sql(
      `SELECT requests.id, requests.title, requests.auction_end, requests.description, requests.current_bid_id, users.name, COALESCE(bids.price_cent, requests.budget_cent) as       price_cent, bids.item_id
      FROM requests LEFT JOIN users ON requests.user_id = users.id
      LEFT JOIN bids on requests.current_bid_id = bids.id
      WHERE user_id = $1 AND requests.request_status = $2
      ORDER BY requests.id DESC
      LIMIT 10`,
      [userId, status],
    );
  }
}
