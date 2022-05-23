import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
class GameController extends BaseController {
  async getAll(_req: Request, res: Response) {
    this.services.game
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

    this.services.game
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

  async getAllByName(req: Request, res: Response) {
    const name: string = req.params?.name;

    this.services.game
      .getAllByName(name)
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
