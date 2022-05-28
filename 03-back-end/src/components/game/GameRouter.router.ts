import GameController from "./GameController.controller";
import GameService from "./GameService.service";
import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";

class GameRouter implements IRouter {
  setupRoutes(
    application: express.Application,
    resources: IApplicationResources
  ) {
    const gameController: GameController = new GameController(
      resources.services
    );

    application.get("/api/game", gameController.getAll.bind(gameController));
    application.get(
      "/api/game/:gid",
      gameController.getById.bind(gameController)
    );
    application.get(
      "/api/game/name/:gname",
      gameController.getByName.bind(gameController)
    );
  }
}

export default GameRouter;
