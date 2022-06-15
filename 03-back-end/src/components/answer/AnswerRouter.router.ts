import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AnswerController from "./AnswerController.controller";

class AnswerRouter implements IRouter {
  setupRoutes(
    application: express.Application,
    resources: IApplicationResources
  ) {
    const answerController: AnswerController = new AnswerController(
      resources.services
    );

    application.get(
      "/api/answer",
      answerController.getAll.bind(answerController)
    );
    application.get(
      "/api/answer/:aid",
      answerController.getById.bind(answerController)
    );
  }
}

export default AnswerRouter;
