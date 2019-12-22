/*
 * DB interface defined here
 */

import { Pool, QueryResult, Client } from 'pg';

interface Params {
  user: string;
  host: string;
  database: string;
}

class DB {
  constructor(dbParams: Params) {
    const existingPool = DB.findPool(dbParams);
    if (existingPool) return existingPool;

    this.params = dbParams;
    this.pool = new Pool(dbParams);
    DB.registerPool(this);
  }

  static findPool(dbParams: Params): Pool {
    return DB.pools.find(
      ({ params: { user, host, database } }) =>
        user === dbParams.user &&
        host === dbParams.host &&
        database === dbParams.database,
    );
  }

  static registerPool(db: DB) {
    DB._pools.push(db);
  }

  static get pools() {
    return DB._pools;
  }

  /**
   * Perfoms SQL queries
   * @param {string} text - SQL query. Params in the string must
   *  appear as '$n', n referring to their respective position (1-based) in the params array.
   * @param {any[]} [params] - Parameters to be parsed into the SQL query.
   * @return Promise resolving to an array of the entries matching the SQL query.
   */
  query(text: string, params = []): QueryResult {
    return this.pool.query(text, params).then(data => data.rows);
  }

  /**
   * Perfoms SQL transactions
   * All queries are executed on the same client
   * @param {Function} callback - Async callback function
   * taking one parameter: a function with signature and behaviour identical to DB.prototype.query().
   * @return Promise resolving to the return value of the callback function.
   */
  transaction(callback) {
    return (async () => {
      const client: Client = await this.pool.connect();
      try {
        // start transaction
        await client.query('BEGIN');

        // query function to be passed to the callback
        const query = (text: string, params: [] = []) =>
          client.query(text, params).then(data => data.rows);
        const output = await callback(query);

        // commit if no errors
        await client.query('COMMIT');

        return output;
      } catch (err) {
        // if error, rollback all changes to db
        await client.query('ROLLBACK');
        throw err;
      } finally {
        // in all instances, return the client to the pool
        client.release();
      }
    })();
  }
}

// Static property
DB._pools = [];

module.exports = (dbParams: Params) => {
  return new DB(dbParams);
};
