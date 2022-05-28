import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import ExpressionController from "./ExpressionController.controller";
import ExpressionService from "./ExpressionService.service";

class ExpressionRouter implements IRouter {
  setupRoutes(
    application: express.Application,
    resources: IApplicationResources
  ) {
    const expressionController: ExpressionController = new ExpressionController(
      resources.services
    );

    application.get(
      "/api/expression",
      expressionController.getAll.bind(expressionController)
    );
    application.get(
      "/api/expression/:eid",
      expressionController.getById.bind(expressionController)
    );
    application.get(
      "/api/expression/value/:evalue",
      expressionController.getAllByExpressionValue.bind(expressionController)
    );
    application.post(
      "/api/expression",
      expressionController.add.bind(expressionController)
    );
    application.put(
      "/api/expression/:eid",
      expressionController.edit.bind(expressionController)
    );
  }
}

export default ExpressionRouter;
