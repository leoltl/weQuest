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
  user_list: User[];
}

type SQLQuery = Promise<String>;

class UserService {
  public findAll(): SQLQuery {
    try {
      return Promise.resolve('test');
      // return db.query('SELECT * FROM users');
    } catch (err) {
      throw Error(`Could not retrieve all users. Error: ${err.message}`);
    }
  }

  public find(id: number): SQLQuery {
    try {
      return Promise.resolve('test');
      // return db.query('SELECT * FROM users');
    } catch (err) {
      throw Error(`Could not retrieve all users. Error: ${err.message}`);
    }
  }

  public create(user: User): SQLQuery {
    try {
      return Promise.resolve('test');
      // return db.query('SELECT * FROM users');
    } catch (err) {
      throw Error(`Could not retrieve all users. Error: ${err.message}`);
    }
  }

  public update(user: User): SQLQuery {
    try {
      return Promise.resolve('test');
      // return db.query('SELECT * FROM users');
    } catch (err) {
      throw Error(`Could not retrieve all users. Error: ${err.message}`);
    }
  }

  public remove(id: number): SQLQuery {
    try {
      return Promise.resolve('test');
      // return db.query('SELECT * FROM users');
    } catch (err) {
      throw Error(`Could not retrieve all users. Error: ${err.message}`);
    }
  }
}

export default new UserService();
