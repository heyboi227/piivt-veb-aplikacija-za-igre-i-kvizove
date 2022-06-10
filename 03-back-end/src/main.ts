import * as cors from "cors";
import * as express from "express";
import { DevConfig } from "./configs";
import IConfig from "./common/IConfig.interface";
import * as fs from "fs";
import * as morgan from "morgan";
import IApplicationResources from "./common/IApplicationResources.interface";
import * as mysql2 from "mysql2/promise";
import CountryService from "./components/country/CountryService.service";
import ExpressionService from "./components/expression/ExpressionService.service";
import GameService from "./components/game/GameService.service";
import WordService from "./components/word/WordService.service";
import UserService from "./components/user/UserService.service";
import QuestionService from "./components/question/QuestionService.service";

async function main() {
  const config: IConfig = DevConfig;

  fs.mkdirSync("./log-files", {
    mode: 0o755,
    recursive: true,
  });

  const db = await mysql2.createConnection({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    charset: config.database.charset,
    timezone: config.database.timezone,
    supportBigNumbers: config.database.supportBigNumbers,
  });

  const applicationResources: IApplicationResources = {
    databaseConnection: db,
    services: {
      game: null,
      word: null,
      user: null,
      country: null,
      expression: null,
      question: null,
    },
  };

  applicationResources.services.game = new GameService(applicationResources);
  applicationResources.services.word = new WordService(applicationResources);
  applicationResources.services.user = new UserService(applicationResources);
  applicationResources.services.country = new CountryService(
    applicationResources
  );
  applicationResources.services.expression = new ExpressionService(
    applicationResources
  );
  applicationResources.services.question = new QuestionService(
    applicationResources
  );

  const application: express.Application = express();

  application.use(
    morgan(config.logging.format, {
      stream: fs.createWriteStream(
        config.logging.path + "/" + config.logging.filename,
        { flags: "a" }
      ),
    })
  );

  application.use(cors());
  application.use(express.json());

  application.use(
    config.server.static.route,
    express.static(config.server.static.path, {
      index: config.server.static.index,
      dotfiles: config.server.static.dotfiles,
      cacheControl: config.server.static.cacheControl,
      etag: config.server.static.etag,
      maxAge: config.server.static.maxAge,
    })
  );

  for (const router of config.routers) {
    router.setupRoutes(application, applicationResources);
  }

  application.get("/welcome", (_req, res) => {
    res.send("<h1>Flagalica</h1><p>Dobrošli u naš kviz!</p>");
  });

  application.use((_req, res) => {
    res.sendStatus(404);
  });

  application.listen(config.server.port);
}

process.on("uncaughtException", (error) => {
  console.error("ERROR: ", error);
});

main();
