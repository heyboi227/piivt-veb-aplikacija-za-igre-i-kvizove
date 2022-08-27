import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import { DefaultScoreAdapterOptions } from "./ScoreService.service";
import { AddScoreValidator, IAddScoreDto } from "./dto/IAddScore.dto";
import { DefaultUserAdapterOptions } from "../user/UserService.service";

export default class ScoreController extends BaseController {
  getAll(req: Request, res: Response) {
    this.services.score
      .getAll(DefaultScoreAdapterOptions)
      .then((result) => {
        res.send(result);
      })
      .catch((error: { message: any }) => {
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 500);
      });
  }

  getById(req: Request, res: Response) {
    const scoreId: number = +req.params?.sid;

    this.services.score
      .getById(scoreId, DefaultScoreAdapterOptions)
      .then((result) => {
        if (result === null) {
          res.status(404).send("Score not found!");
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 500);
      });
  }

  getByUserId(req: Request, res: Response) {
    const userId: number = +req.params?.uid;

    this.services.user
      .getById(userId, DefaultUserAdapterOptions)
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "User not found!",
          };
        }

        this.services.score
          .getAllByUserId(userId)
          .then((result) => {
            res.send(result);
          })
          .catch((error) => {
            throw {
              status: 500,
              message: error?.message,
            };
          });
      })
      .catch((error) => {
        res.status(error?.status ?? 500).send(error?.message);
      });
  }

  add(req: Request, res: Response) {
    const data = req.body as IAddScoreDto;

    if (!AddScoreValidator(data)) {
      return res.status(400).send(AddScoreValidator.errors);
    }

    this.services.score.startTransaction().then(() => {
      this.services.score
        .add({
          user_id: data.userId,
          value: data.value,
        })
        .then(async (result) => {
          await this.services.score.commitChanges();
          res.send(result);
        })
        .catch(async (error) => {
          await this.services.score.rollbackChanges();
          res.status(400).send(error?.message);
        });
    });
  }

  delete(req: Request, res: Response) {
    const id: number = +req.params?.aid;

    this.services.score.startTransaction().then(() => {
      this.services.score
        .getById(id, DefaultScoreAdapterOptions)
        .then((result) => {
          if (result === null) {
            throw {
              status: 404,
              message: "The score is not found!",
            };
          }

          this.services.score
            .deleteById(id)
            .then(async () => {
              await this.services.question.commitChanges();
              res.send("This score has been deleted!");
            })
            .catch((error) => {
              throw {
                status: 500,
                message: error?.message,
              };
            });
        })
        .catch(async (error) => {
          await this.services.question.rollbackChanges();
          setTimeout(() => {
            res.status(error?.status ?? 500).send(error?.message);
          }, 500);
        });
    });
  }
}
