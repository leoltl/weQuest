// tslint:disable: import-name
import { Request, Response, NextFunction } from 'express';
import Socket from './socket';
import socketIO from 'socket.io';

declare module 'socket.io' {
  interface Socket {
    sessionId?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      sessionId?: string;
    }
  }
}

/**
 * Middleware to check if user if logged in
 * If not logged responds with error
 */
export function accessControl(req: Request, res: Response, next: NextFunction): Response | void {
  if (!req.session || !req.session.userId) {
    return res.status(403).json({ error: 'Unauthorized acess' });
  }
  next();
}

export function isDate(val: any): boolean {
  return val instanceof Date;
}

// converts header cookies field into object
export function parseCookies(cookieString: string | undefined): Record<string, string> {
  return cookieString
    ? cookieString.split('; ').reduce(
      (cookies: Record<string, string>, item: string) => {
        const [key, value] = item.split('=');
        cookies[key] = value;
        return cookies;
      },
      {},
    )
    : {};
}

// decode base64
export function decode64(str: string): string {
  return Buffer.from(str, 'base64').toString('utf8');
}

// socket middleware to attach session.sig cookie value to client object
export function socketSessionIdParser(client: socketIO.Socket, next: (err?: any) => void) {
  const cookies = parseCookies(client.handshake.headers.cookie);

  // no socket capability if sessionId cannot be found
  // if (!cookies['session.sig']) return next(Error('Cannot retrieve the session Id'));
  if (!cookies['io']) return next(Error('Cannot retrieve the session Id'));

  // attach 'sessionId' key to client object
  // client.sessionId = cookies['session.sig'];
  client.sessionId = cookies['io'];
  next();
}

// express middleware to force session creation (so session.sig cookie is created)
export function forceSession(req: Request, res: Response, next: NextFunction) {
  if (req.session!.isNew) req.session!.forceSession = true;
  next();
}

// express middleware to attach session.sig cookie value to req object
export function sessionIdParser(req: Request, res: Response, next: NextFunction) {
  const cookies = parseCookies(req.headers.cookie);

  // if (!cookies['session.sig']) return next(Error('Cannot retrieve the session Id'));
  // if (!cookies['session.sig']) console.error('ERROR: Cannot retrieve the session Id');
  if (!cookies['io']) console.error('ERROR: Cannot retrieve the session Id', req.url);

  // attach 'sessionId' key to req object
  // req.sessionId = cookies['session.sig'];
  req.sessionId = cookies['io'];
  next();
}

// express middleware to store userId/session combo
export function storeSessionId(req: Request, res: Response, next: NextFunction) {
  const userId: number = req.session!.userId;
  const sessionId: string = req.sessionId!;
  if (userId && sessionId && sessionIdStore.get({ userId }) !== sessionId) sessionIdStore.set(userId, sessionId);
  next();
}

export type SessionIdStoreOptionsUserId = {
  userId: number,
};

export type SessionIdStoreOptionsSessionId = {
  sessionId: string,
};

export class SessionIdStore {
  private sessions: Record<number, string> = {};
  private users: Record<string, number> = {};

  // public get(userId: number): string {
  //   return this.sessions[userId];
  // }

  get(options: SessionIdStoreOptionsUserId): string;
  get(options: SessionIdStoreOptionsSessionId): number;
  public get(options: SessionIdStoreOptionsUserId | SessionIdStoreOptionsSessionId): number | string | undefined {
    if ('userId' in options) return this.sessions[options.userId];
    if ('sessionId' in options) return this.users[options.sessionId];
    return undefined;
  }

  public set(userId: number, sessionId: string): this {
    this.sessions[userId] = sessionId;
    this.users[sessionId] = userId;
    return this;
  }

  // public delete(userId: number): this {
  //   const sessionId = this.sessions[userId];
  //   delete this.sessions[userId];
  //   delete this.users[sessionId];
  //   return this;
  // }

  delete(options: SessionIdStoreOptionsUserId): this;
  delete(options: SessionIdStoreOptionsSessionId): this;
  public delete(options: SessionIdStoreOptionsUserId | SessionIdStoreOptionsSessionId): this {
    const userId = 'userId' in options ? options.userId :  this.users[options.sessionId];
    const sessionId = 'sessionId' in options ? options.sessionId :  this.sessions[options.userId];

    delete this.sessions[userId];
    delete this.users[sessionId];

    return this;
  }

  // public has(userId: number): boolean {
  //   return userId in this.sessions;
  // }
  has(options: SessionIdStoreOptionsUserId): boolean;
  has(options: SessionIdStoreOptionsSessionId): boolean;
  public has(options: SessionIdStoreOptionsUserId | SessionIdStoreOptionsSessionId): boolean {
    if ('userId' in options) return options.userId in this.sessions;
    if ('sessionId' in options) return options.sessionId in this.users;
    return false;
  }
}

export const sessionIdStore = new SessionIdStore();

// send notification to user
export function notifyUser(userId: number, message: string, socket: Socket): void {
  sessionIdStore.has({ userId }) && socket.emitNotification(sessionIdStore.get({ userId }), message);
}
