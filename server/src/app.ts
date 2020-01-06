import express, { Application } from 'express';
import path from 'path';

export default class App {
  public app: Application;
  public port: number;

  constructor(appInit: { port: number; middlewares: any[]; controllers: any[] }) {
    this.app = express();
    this.port = appInit.port;

    this.middlewares(appInit.middlewares);
    this.routes(appInit.controllers);
    this.assets();
  }

  private middlewares(middlewares: any[]) {
    middlewares.forEach((middleware): void => {
      this.app.use(middleware);
    });
  }

  private routes(controllers: any[]) {
    controllers.forEach((controller):void => {
      this.app.use(controller.path, controller.router);
    });
  }

  private assets() {
    this.app.use(express.static(path.join(__dirname, 'public')));
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`weQuest App listening on the http://localhost:${this.port}`);
    });
  }
}
