import express from 'express';
import { Application } from 'express';
import path = require('path');

class App {
  public app: Application;
  public port: string;

  constructor(appInit: { port: string; middleWares: any; controllers: any }) {
    this.app = express();
    this.port = appInit.port;

    this.middlewares(appInit.middleWares);
    this.routes(appInit.controllers);
    this.assets();
  }

  private middlewares(middleWares: {
    forEach: (arg0: (middleWare: any) => void) => void;
  }) {
    middleWares.forEach(middleWare => {
      this.app.use(middleWare);
    });
  }

  private routes(controllers: {
    forEach: (arg0: (controller: any) => void) => void;
  }) {
    controllers.forEach(controller => {
      this.app.use(controller.path, controller.router);
    });
  }

  private assets() {
    this.app.use(express.static(path.join(__dirname, 'public')));
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(
        `weQuest  App listening on the http://localhost:${this.port}`,
      );
    });
  }
}

export default App;
