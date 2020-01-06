// tslint:disable-next-line: import-name
import Model from '../lib/model';

import SQL, { and, or } from '../lib/sql';
// tslint:disable-next-line: import-name

export interface UserInterface {
  id: number;
  name: string;
  password: string;
  email: string;
  postal_code: string;
  latitude: number;
  longtitude: number;
}

export default class User extends Model {
  protected init() {
    this.alias = 'users';
    this.table = 'users';

    this.columns = {
      id: { name: 'id', type: Number.isInteger, primaryKey: true },
      name: { name: 'name', type: 'string', required: true },
      email: {
        name: 'email',
        type: RegExp.prototype.test.bind(
          /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        ),
        required: true,
      },
      password: { name: 'password_digest', type: 'string', required: true },
      postalCode: { name: 'postal_code', type: 'string', required: false },
      latitude: { name: 'latitude', type: 'number', required: false },
      longitude: { name: 'longitude', type: 'number', required: false },
    };

    this.joins = {};
  }

  public findByName(name: string): SQL {
    return this.select()
      .where({ name })
      .order([['id', 'DESC']]);
  }

  public createUser(user: User): SQL {
    return this.create(user);
  }
}
