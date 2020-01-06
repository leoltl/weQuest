/*
 * DB interface
 */

// tslint:disable-next-line: import-name
import { Pool } from 'pg';
import camelcaseKeys from 'camelcase-keys';

export type DBParams = {
  host: string,
  port: number,
  database: string,
  user: string,
  password: string,
};

export default class DB {

  private pool: Pool | null = null;
  private static instances: DB[] = [];
  private static instanceEqualityChecks: (keyof DBParams)[] = ['host', 'database', 'port', 'user'];

  constructor(private params: DBParams) {
    const existingInstance = DB.findInstance(params);
    if (existingInstance) return existingInstance;

    this.pool = new Pool(params);
    this.query = this.query.bind(this);

    DB.registerInstance(this);
  }

  private static findInstance(params: DBParams): DB | undefined {
    return this.instances.find(
      (instance: DB): boolean => {
        return this.instanceEqualityChecks.every((param): boolean => instance.params[param] === params[param]);
      });
  }

  private static registerInstance(instance: DB): void {
    this.instances.push(instance);
  }

  /**
   * Perfoms SQL queries
   * @param text SQL query.
   * Params in the string must appear as '$n', n referring to their respective position (1-based) in the params array.
   * @param [params] Parameters to be parsed into the SQL query.
   * @return Promise resolving to an array of the entries matching the SQL query.
   */
  public query(text: string, params: any[] = []): Promise<any[]> {
    return this.pool!.query(text, params).then(data => data.rows.map(row => camelcaseKeys(row)));
  }

  /**
   * Perfoms SQL transactions
   * All queries are executed on the same client
   * @param callback Async callback function taking one parameter:
   * a function with signature and behaviour identical to DB.prototype.query().
   * @return Promise resolving to the return value of the callback function.
   */
  transaction(callback: (query: (text: string, params?: any[]) => Promise<any[]>) => Promise<any>): Promise<any> {
    return (async () => {
      const client = await this.pool!.connect();
      try {
        // start transaction
        await client.query('BEGIN');

        // query function to be passed to the callback
        const query = (text: string, params: any[] = []): Promise<any[]> => client.query(text, params)
        .then(data => data.rows.map(row => camelcaseKeys(row)));
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
