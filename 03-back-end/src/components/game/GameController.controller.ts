import GameService from "./GameService.service";
import { Request, Response } from "express";
class GameController {
  private gameService: GameService;

  constructor(gameService: GameService) {
    this.gameService = gameService;
  }

  async getAll(_req: Request, res: Response) {
    this.gameService
      .getAll()
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  async getById(req: Request, res: Response) {
    const id: number = +req.params?.id;

    this.gameService
      .getById(id)
      .then((result) => {
        if (result === null) {
          return res.sendStatus(404);
        }

        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }
}

export default GameController;
