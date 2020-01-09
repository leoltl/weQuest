// tslint:disable-next-line: import-name
import Model from '../lib/model';

// tslint:disable-next-line: import-name
import SQL, { and, or } from '../lib/sql';

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
      password: { name: 'password', type: 'string', required: true },
      postalCode: { name: 'postal_code', type: 'string', required: false },
      latitude: { name: 'latitude', type: 'number', required: false },
      longitude: { name: 'longitude', type: 'number', required: false },
    };

    this.joins = {};
  }

  public findByEmail(email: string): SQL {
    return this.select().where({ email });
  }

  public findById(id: number): SQL {
    console.log(
      this.select()
        .where({ id })
        .limit(1)
        .do(),
    );
    return this.select()
      .where({ id })
      .limit(1);
  }

  public createUser(user: User): SQL {
    return this.create(user);
  }
}
