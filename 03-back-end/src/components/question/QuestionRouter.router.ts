import * as express from "express";
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
      questionController.getAll.bind(questionController)
    );
    application.get(
      "/api/question/:qid",
      questionController.getById.bind(questionController)
    );
    application.get(
      "/api/question/game/:gid",
      questionController.getByGameId.bind(questionController)
    );
    application.post(
      "/api/question",
      questionController.add.bind(questionController)
    );
    application.put(
      "/api/question/:qid",
      questionController.edit.bind(questionController)
    );
    application.delete(
      "/api/question/:qid",
      questionController.delete.bind(questionController)
    );
  }
}

export default QuestionRouter;
