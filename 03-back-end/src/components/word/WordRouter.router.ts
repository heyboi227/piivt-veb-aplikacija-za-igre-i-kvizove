import WordController from "./WordController.controller";
import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";

class WordRouter implements IRouter {
  setupRoutes(
    application: express.Application,
    resources: IApplicationResources
  ) {
    const wordController: WordController = new WordController(
      resources.services
    );

    application.get("/api/word", wordController.getAll.bind(wordController));
    application.get(
      "/api/word/:wid",
      wordController.getById.bind(wordController)
    );
    application.get(
      "/api/word/:wname",
      wordController.getAllByName.bind(wordController)
    );
    application.post("/api/word", wordController.add.bind(wordController));
    application.put("/api/word/:wid", wordController.edit.bind(wordController));
    application.delete(
      "/api/word/:wid",
      wordController.delete.bind(wordController)
    );
  }
}

export default WordRouter;
