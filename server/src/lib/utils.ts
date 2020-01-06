import { Request, Response, NextFunction } from 'express';

// add userId to global Request interface
declare global {
  namespace Express {
    export interface Request {
      userId?: number;
    }
  }
}

/**
 * Middleware to check if user if logged in
 * If logged in attaches userId to req, otherwise responds with error
 */
export function accessControl(req: Request, res: Response , next: NextFunction): Response | void {
  if (!req.session || !req.session.userId) return res.status(403).json({ error: 'Unauthorized acess' });
  req.userId = parseInt(req.session!.userId, 10);
  next();
}
