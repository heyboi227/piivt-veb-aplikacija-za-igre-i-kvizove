import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import { DefaultAnswerAdapterOptions } from "./AnswerService.service";
import { AddAnswerValidator, IAddAnswerDto } from "./dto/IAddAnswer.dto";
import { EditAnswerValidator, IEditAnswerDto } from "./dto/IEditAnswer.dto";

export default class AnswerController extends BaseController {
  getAllByQuestionId(req: Request, res: Response) {
    const questionId: number = +req.params?.qid;

    this.services.question
      .getById(questionId, {
        loadGame: true,
        showAnswers: true,
      })
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Question not found!",
          };
        }

        this.services.answer
          .getAllByQuestionId(questionId)
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
    const data = req.body as IAddAnswerDto;

    if (!AddAnswerValidator(data)) {
      return res.status(400).send(AddAnswerValidator.errors);
    }

    this.services.answer.startTransaction().then(() => {
      this.services.answer
        .add({
          question_id: data.questionId,
          answer_value: data.answerValue,
          is_correct: data.isCorrect,
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
            const answer = await this.services.answer.edit(id, {
              question_id: data.questionId,
              answer_value: data.answerValue,
              is_correct: data.isCorrect,
            });
            await this.services.answer.commitChanges();
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
}
