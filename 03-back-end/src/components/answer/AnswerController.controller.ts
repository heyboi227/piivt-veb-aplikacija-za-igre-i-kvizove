import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import { DefaultAnswerAdapterOptions } from "./AnswerService.service";
import { AddAnswerValidator, IAddAnswerDto } from "./dto/IAddAnswer.dto";
import { EditAnswerValidator, IEditAnswerDto } from "./dto/IEditAnswer.dto";

export default class AnswerController extends BaseController {
  getAll(req: Request, res: Response) {
    this.services.answer
      .getAll(DefaultAnswerAdapterOptions)
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
    const id: number = +req.params?.aid;

    this.services.answer
      .getById(id, DefaultAnswerAdapterOptions)
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Answer not found!",
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

  getByAnswerValue(req: Request, res: Response) {
    const answerValue: string = req.params?.avalue;

    this.services.answer
      .getByAnswerValue(answerValue, DefaultAnswerAdapterOptions)
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Answer not found!",
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

  add(req: Request, res: Response) {
    const data = req.body as IAddAnswerDto;

    if (!AddAnswerValidator(data)) {
      return res.status(400).send(AddAnswerValidator.errors);
    }

    this.services.answer.startTransaction().then(() => {
      this.services.answer
        .add({
          game_id: data.gameId,
          answer_value: data.answerValue,
        })
        .then(async (result) => {
          await this.services.answer.commitChanges();
          res.send(result);
        })
        .catch(async (error) => {
          await this.services.answer.rollbackChanges();
          res.status(400).send(error?.message);
        });
    });
  }

  edit(req: Request, res: Response) {
    const id: number = +req.params?.aid;
    const data = req.body as IEditAnswerDto;

    if (!EditAnswerValidator(data)) {
      return res.status(400).send(EditAnswerValidator.errors);
    }

    this.services.answer.startTransaction().then(() => {
      this.services.answer
        .getById(id, DefaultAnswerAdapterOptions)
        .then((result) => {
          if (result === null) {
            throw {
              status: 404,
              message: "The answer is not found!",
            };
          }
        })
        .then(async () => {
          try {
            const answer = await this.services.answer.editById(id, {
              game_id: data.gameId,
              answer_value: data.answerValue,
            });
            await this.services.question.commitChanges();
            res.send(answer);
          } catch (error) {
            throw {
              status: 400,
              message: error?.message,
            };
          }
        })
        .catch(async (error) => {
          await this.services.answer.rollbackChanges();
          setTimeout(() => {
            res.status(error?.status ?? 500).send(error?.message);
          }, 500);
        });
    });
  }

  delete(req: Request, res: Response) {
    const id: number = +req.params?.aid;

    this.services.answer.startTransaction().then(() => {
      this.services.answer
        .getById(id, DefaultAnswerAdapterOptions)
        .then((result) => {
          if (result === null) {
            throw {
              status: 404,
              message: "The answer is not found!",
            };
          }

          this.services.answer
            .deleteById(id)
            .then(async () => {
              await this.services.question.commitChanges();
              res.send("This answer has been deleted!");
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
