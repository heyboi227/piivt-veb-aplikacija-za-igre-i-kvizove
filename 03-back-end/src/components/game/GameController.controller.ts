import GameService from "./GameService.service";
import { Request, Response } from "express";
class GameController {
  private gameService: GameService;

  constructor(gameService: GameService) {
    this.gameService = gameService;
  }

  async getAll(_req: Request, res: Response) {
    res.send(await this.gameService.getAll());
  }

  async getById(req: Request, res: Response) {
    const id: number = +req.params?.id;

    const category = await this.gameService.getById(id);

    if (category === null) {
      return res.sendStatus(404);
    }

    res.send(category);
  }
}

export default GameController;
