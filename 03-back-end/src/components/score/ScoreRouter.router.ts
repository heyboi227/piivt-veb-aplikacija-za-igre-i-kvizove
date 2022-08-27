import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import ScoreController from "./ScoreController.controller";

class ScoreRouter implements IRouter {
  setupRoutes(
    application: express.Application,
    resources: IApplicationResources
  ) {
    const scoreController: ScoreController = new ScoreController(
      resources.services
    );

    application.get(
      "/api/score",
      AuthMiddleware.getVerifier("activeUser", "administrator"),
      scoreController.getAll.bind(scoreController)
    );
    application.get(
      "/api/score/:aid",
      AuthMiddleware.getVerifier("administrator"),
      scoreController.getById.bind(scoreController)
    );
    application.get(
      "/api/score/user/:uid",
      AuthMiddleware.getVerifier("activeUser", "administrator"),
      scoreController.getByUserId.bind(scoreController)
    );
    application.post(
      "/api/score",
      AuthMiddleware.getVerifier("activeUser", "administrator"),
      scoreController.add.bind(scoreController)
    );
    application.put(
      "/api/score/:aid",
      AuthMiddleware.getVerifier("activeUser", "administrator"),
      scoreController.edit.bind(scoreController)
    );
    application.delete(
      "/api/score/:aid",
      AuthMiddleware.getVerifier("administrator"),
      scoreController.delete.bind(scoreController)
    );
  }
}

export default ScoreRouter;
