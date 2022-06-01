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
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 500);
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
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 500);
      });
  }

  getByName(req: Request, res: Response) {
    const name: string = req.params?.cname;

    this.services.country
      .getByName(name)
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "The country is not found!",
          };
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }

  getByCountryCode(req: Request, res: Response) {
    const countryCode: string = req.params?.ccode;

    this.services.country
      .getByCountryCode(countryCode)
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "The country is not found!",
          };
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }
}

export default CountryController;
