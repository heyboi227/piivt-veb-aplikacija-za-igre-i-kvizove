import * as express from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AnswerController from "../answer/AnswerController.controller";
import QuestionController from "./QuestionController.controller";

class QuestionRouter implements IRouter {
  setupRoutes(
    application: express.Application,
    resources: IApplicationResources
  ) {
    const questionController: QuestionController = new QuestionController(
      resources.services
    );
    const answerController: AnswerController = new AnswerController(
      resources.services
    );

    application.get(
      "/api/question",
      AuthMiddleware.getVerifier("activeUser", "user", "administrator"),
      questionController.getAll.bind(questionController)
    );
    application.get(
      "/api/question/:qid",
      AuthMiddleware.getVerifier("activeUser", "user", "administrator"),
      questionController.getById.bind(questionController)
    );
    application.get(
      "/api/question/game/:gid",
      AuthMiddleware.getVerifier("activeUser", "user", "administrator"),
      questionController.getByGameId.bind(questionController)
    );
    application.get(
      "/api/question/user/:uid",
      AuthMiddleware.getVerifier("activeUser", "administrator"),
      questionController.getByUserId.bind(questionController)
    );
    application.post(
      "/api/question",
      AuthMiddleware.getVerifier("activeUser", "administrator"),
      questionController.add.bind(questionController)
    );
    application.put(
      "/api/question/:qid",
      AuthMiddleware.getVerifier("activeUser", "administrator"),
      questionController.edit.bind(questionController)
    );
    application.delete(
      "/api/question/:qid",
      AuthMiddleware.getVerifier("activeUser", "administrator"),
      questionController.delete.bind(questionController)
    );
  }
}

export default QuestionRouter;
