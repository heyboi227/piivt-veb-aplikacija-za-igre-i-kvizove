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
    application.post(
      "/api/answer",
      answerController.add.bind(answerController)
    );
    application.put(
      "/api/answer/:aid",
      answerController.edit.bind(answerController)
    );
    application.delete(
      "/api/answer/:aid",
      answerController.delete.bind(answerController)
    );
  }
}

export default AnswerRouter;
