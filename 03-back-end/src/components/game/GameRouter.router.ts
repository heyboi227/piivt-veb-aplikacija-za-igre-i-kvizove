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
    const gameService: GameService = new GameService(
      resources.databaseConnection
    );
    const gameController: GameController = new GameController(
      resources.services
    );

    application.get("/api/game", gameController.getAll.bind(gameController));
    application.get(
      "/api/game/:id",
      gameController.getById.bind(gameController)
    );
    application.get(
      "/api/game/name/:name",
      gameController.getAllByName.bind(gameController)
    );
  }
}

export default GameRouter;
