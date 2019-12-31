import { User, Users } from '../interfaces/users';
type SQLQuery = Promise<String>;

/* Could not export UserService class without singleton Why?? */
class UserService {}
const { Pool }: any = require('pg');

import { config } from 'dotenv';
config();

/* temp db connection for mock purpose*/
const dbParams = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

const db = new Pool(dbParams);

export async function mockFindAll(): SQLQuery {
  try {
    // return Promise.resolve('test');
    const result = await db.query('SELECT * FROM requests LIMIT 10');
    return result.rows;
  } catch (err) {
    throw Error(`Could not retrieve all users. Error: ${err.message}`);
  }
}

export function findAll(): SQLQuery {
  try {
    // return Promise.resolve('test');
    return db.query('SELECT * FROM requests LIMIT 10');
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
