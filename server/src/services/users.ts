/**
 Middleware to related to users
**/
import bcrypt = require('bcrypt');
import expressSession = require('express-session');
import { Response, Request, NextFunction } from 'express';
import { User, Users } from '../interfaces/users';

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session) {
    if (!req.session.userId) {
      return res.status(403).json({ error: 'not authorized' });
    }
  }
};

const getCurrentUser = (req: Request, res: Response) => {
  req.session
    ? req.session.userId
    : res.status(403).json({ error: 'no available session' });
};

const login = async (
  db: any,
  req: Request,
  email: string,
  password: string,
  id: number,
) => {
  try {
    let userId = req!.session!.Id || id;
    let user: User;

    if (!userId) {
      user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (!bcrypt.compareSync(password, user.password)) {
        throw Error('Incorrect Password | email does not exist in our system');
      }

      userId = user.id;
    } else {
      user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    }
  } catch (err) {
    throw Error(`Failed to login: ERROR: ${err}`);
  }
};

const logout = (req: Request) => {
  if (req.session) {
    req.session.userId && delete req.session.userId;
  }
};

const validateInput = (user: User): User => {
  return user;
};

const getLocation = () => {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos: Position) {
    return pos.coords;

    // console.log('Your current position is:');
    // console.log(`Latitude : ${crd.latitude}`);
    // console.log(`Longitude: ${crd.longitude}`);
    // console.log(`More or less ${crd.accuracy} meters.`);
  }

  function error(err: PositionError) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  return navigator.geolocation.getCurrentPosition(success, error, options);
};

const create = async (db: any, user: User) => {
  try {
    const safeUser = validateInput(user);
    const { name, email, password } = safeUser;

    return db.transaction(async (query: any) => {
      // TODO: implement getLocation
      // returns POSTAL_CODE, LAT, LONG
      const location = getLocation();

      const bookedUser = await query(
        `
        INSERT INTO users (email, password, postal_code, latitude, longtitude)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `,
        [email, bcrypt.hashSync(password, 10), location],
      );

      const [{ id: userId, username: bookedUsername }] = bookedUser;

      const isUnique = await query(
        `
        SELECT * FROM users WHERE username = $1;
      `,
        [bookedUsername],
      );

      if (isUnique.length !== 1) throw Error('Username is not unique');

      return userId;
    });
  } catch (err) {
    throw Error(
      `User could not be created due to an error. Error: ${err.message}.`,
    );
  }
};

module.exports = {
  isAuthenticated,
  getCurrentUser,
  login,
  logout,
  createUser: create,
};
