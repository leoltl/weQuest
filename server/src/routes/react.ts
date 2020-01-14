import { Router, Request } from 'express';

export default class ReactController {
  public path = '/';
  public router: Router = Router();

  constructor() {
    this.initRoutes();
  }

  

  private initRoutes() {
    this.router.get('*', (req, res) => {
      res.sendFile('server/build/public/index.html');
    });
  }
}
