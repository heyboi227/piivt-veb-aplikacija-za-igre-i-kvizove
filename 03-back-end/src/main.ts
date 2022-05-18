import * as cors from "cors";
import * as express from "express";
import { DevConfig } from "./config/configs";
import IConfig from "./config/IConfig.interface";
import GameService from "./components/game/GameService.service";
import GameController from "./components/game/GameController.controller";

const config: IConfig = DevConfig;

const application: express.Application = express();

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

const gameService: GameService = new GameService();
const gameController: GameController = new GameController(gameService);

application.get("/api/game", gameController.getAll.bind(gameController));
application.get("/api/game/:id", gameController.getById.bind(gameController));

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
