import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
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
      AuthMiddleware.getVerifier("administrator"),
      answerController.getAll.bind(answerController)
    );
    application.get(
      "/api/answer/:aid",
      AuthMiddleware.getVerifier("administrator"),
      answerController.getById.bind(answerController)
    );
    application.get(
      "/api/answer/answer-value/:avalue",
      AuthMiddleware.getVerifier("activeUser", "administrator"),
      answerController.getByAnswerValue.bind(answerController)
    );
    application.post(
      "/api/answer",
      AuthMiddleware.getVerifier("administrator"),
      answerController.add.bind(answerController)
    );
    application.put(
      "/api/answer/:aid",
      AuthMiddleware.getVerifier("administrator"),
      answerController.edit.bind(answerController)
    );
    application.delete(
      "/api/answer/:aid",
      AuthMiddleware.getVerifier("administrator"),
      answerController.delete.bind(answerController)
    );
  }
}

export default AnswerRouter;
