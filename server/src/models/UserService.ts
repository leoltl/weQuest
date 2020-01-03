import { User, Users } from '../interfaces/users';
const db = require('server/db/database.ts');
type SQLQuery = Promise<Object>;

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
    return Promise.resolve('test');
    // return db.query('SELECT * FROM users');
  } catch (err) {
    throw Error(`Could not retrieve all users. Error: ${err.message}`);
  }
}

export function create(user: User): SQLQuery {
  try {
    // return Promise.resolve({ user_id: 1 });
    return db.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [user.email, user.password],
    );
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
