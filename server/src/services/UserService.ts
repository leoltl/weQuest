interface User {
  id: number;
  name: string;
  password_digest: string;
  email: string;
  postal_code: string;
  latitude: number;
  longtitude: number;
}

interface Users {
  user_list: Array<User>;
}

type SQLQuery = { query: Array<any> };

export default class UserService {
  public findAll(): SQLQuery {
    try {
      return { query: ['test'] };
      // return db.query('SELECT * FROM users');
    } catch (err) {
      throw Error(`Could not retrieve all users. Error: ${err.message}`);
    }
  }

  public find(id: number): SQLQuery {
    try {
      return { query: ['test'] };
      // return db.query('SELECT * FROM users');
    } catch (err) {
      throw Error(`Could not retrieve all users. Error: ${err.message}`);
    }
  }

  public create(user: User): SQLQuery {
    try {
      return { query: ['test'] };
      // return db.query('SELECT * FROM users');
    } catch (err) {
      throw Error(`Could not retrieve all users. Error: ${err.message}`);
    }
  }

  public update(user: User): SQLQuery {
    try {
      return { query: ['test'] };
      // return db.query('SELECT * FROM users');
    } catch (err) {
      throw Error(`Could not retrieve all users. Error: ${err.message}`);
    }
  }

  public remove(id: number): SQLQuery {
    try {
      return { query: ['test'] };
      // return db.query('SELECT * FROM users');
    } catch (err) {
      throw Error(`Could not retrieve all users. Error: ${err.message}`);
    }
  }
}
