import * as cors from "cors";
import * as express from "express";
import { DevConfig } from "./configs";
import IConfig from "./common/IConfig.interface";
import * as fs from "fs";
import * as morgan from "morgan";
import IApplicationResources from "./common/IApplicationResources.interface";
import * as mysql2 from "mysql2/promise";

async function main() {
  const config: IConfig = DevConfig;

  fs.mkdirSync("./logs", {
    mode: 0o755,
    recursive: true,
  });

  const applicationResources: IApplicationResources = {
    databaseConnection: await mysql2.createConnection({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database,
      charset: config.database.charset,
      timezone: config.database.timezone,
      supportBigNumbers: config.database.supportBigNumbers,
    }),
  };

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

  application.get("/game", (_req, res) => {
    res.send([
      {
        game_id: 1,
        name: "Pronađi najdužu reč",
      },
      {
        game_id: 2,
        name: "Pogodi državu",
      },
      {
        game_id: 3,
        name: "Pogodi zastavu",
      },
      {
        game_id: 4,
        name: "Izračunaj izraz",
      },
    ]);
  });

  application.use((_req, res) => {
    res.sendStatus(404);
  });

  application.listen(config.server.port);
}

main();
