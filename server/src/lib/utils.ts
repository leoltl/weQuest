import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to check if user if logged in
 * If not logged responds with error
 */
export function accessControl(req: Request, res: Response , next: NextFunction): Response | void {
  if (!req.session || !req.session.userId) return res.status(403).json({ error: 'Unauthorized acess' });
  next();
}
