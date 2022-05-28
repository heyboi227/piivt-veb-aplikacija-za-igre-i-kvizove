import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
class GameController extends BaseController {
  getAll(_req: Request, res: Response) {
    this.services.game
      .getAll({})
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  getById(req: Request, res: Response) {
    const id: number = +req.params?.gid;

    this.services.game
      .getById(id, {})
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

  getByName(req: Request, res: Response) {
    const name: string = req.params?.gname;

    this.services.game
      .getByName(name)
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
