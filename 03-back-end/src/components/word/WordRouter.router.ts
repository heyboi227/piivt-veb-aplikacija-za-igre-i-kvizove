import WordController from "./WordController.controller";
import WordService from "./WordService.service";
import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";

class WordRouter implements IRouter {
  setupRoutes(
    application: express.Application,
    resources: IApplicationResources
  ) {
    const wordService: WordService = new WordService(
      resources.databaseConnection
    );
    const wordController: WordController = new WordController(wordService);

    application.get("/api/word", wordController.getAll.bind(wordController));
    application.get(
      "/api/word/:id",
      wordController.getById.bind(wordController)
    );
    application.get(
      "/api/word/name/:name",
      wordController.getAllByName.bind(wordController)
    );
    application.post("/api/word", wordController.add.bind(wordController));
  }
}

export default WordRouter;
