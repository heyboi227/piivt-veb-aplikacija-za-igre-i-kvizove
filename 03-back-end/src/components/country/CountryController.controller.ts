import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
class CountryController extends BaseController {
  getAll(_req: Request, res: Response) {
    this.services.country
      .getAll({
        removeCountryCode: false,
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  getById(req: Request, res: Response) {
    const id: number = +req.params?.cid;

    this.services.country
      .getById(id, {
        removeCountryCode: false,
      })
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

  getAllByName(req: Request, res: Response) {
    const name: string = req.params?.cname;

    this.services.country
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

  getAllByCountryCode(req: Request, res: Response) {
    const countryCode: string = req.params?.ccode;

    this.services.country
      .getAllByCountryCode(countryCode)
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

export default CountryController;
