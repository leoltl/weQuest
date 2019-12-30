import { User, Users } from '../interfaces/users';
type SQLQuery = Promise<String>;

/* Could not export UserService class without singleton Why?? */
class UserService {}

export function findAll(): SQLQuery {
  try {
    return Promise.resolve('test');
    // return db.query('SELECT * FROM users');
  } catch (err) {
    throw Error(`Could not retrieve all users. Error: ${err.message}`);
  }
}

export function find(id: number): SQLQuery {
  try {
    return Promise.resolve('test2');
    // return db.query('SELECT * FROM users');
  } catch (err) {
    throw Error(`Could not retrieve all users. Error: ${err.message}`);
  }
}

export function create(user: User): SQLQuery {
  try {
    return Promise.resolve('test');
    // return db.query('SELECT * FROM users');
  } catch (err) {
    throw Error(`Could not retrieve all users. Error: ${err.message}`);
  }
}

export function update(user: User): SQLQuery {
  try {
    return Promise.resolve('test');
    // return db.query('SELECT * FROM users');
  } catch (err) {
    throw Error(`Could not retrieve all users. Error: ${err.message}`);
  }
}

export function remove(id: number): SQLQuery {
  try {
    return Promise.resolve('test');
    // return db.query('SELECT * FROM users');
  } catch (err) {
    throw Error(`Could not retrieve all users. Error: ${err.message}`);
  }
}
