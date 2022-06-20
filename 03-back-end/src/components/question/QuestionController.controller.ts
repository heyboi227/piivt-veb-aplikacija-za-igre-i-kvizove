import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import { DefaultQuestionAdapterOptions } from "./QuestionService.service";
import { AddQuestionValidator, IAddQuestionDto } from "./dto/IAddQuestion.dto";
import {
  EditQuestionValidator,
  IEditQuestionDto,
} from "./dto/IEditQuestion.dto";

export default class QuestionController extends BaseController {
  getAll(req: Request, res: Response) {
    this.services.question
      .getAll(DefaultQuestionAdapterOptions)
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
    const id: number = +req.params?.qid;

    this.services.question
      .getById(id, DefaultQuestionAdapterOptions)
      .then((result) => {
        if (result === null) {
          res.status(404).send("Question not found!");
        }

        res.send(result);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(500).send(error?.message);
        }, 500);
      });
  }

  getByGameId(req: Request, res: Response) {
    const gameId: number = +req.params?.gid;

    this.services.game
      .getById(gameId, {})
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Game not found!",
          };
        }

        this.services.question
          .getAllByGameId(gameId)
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
    const data = req.body as IAddQuestionDto;

    if (!AddQuestionValidator(data)) {
      return res.status(400).send(AddQuestionValidator.errors);
    }

    this.services.question.startTransaction().then(() => {
      this.services.question
        .add({
          game_id: data.gameId,
          title: data.title,
        })
        .then((result) => {
          return this.services.question.getById(
            result.questionId,
            DefaultQuestionAdapterOptions
          );
        })
        .then((result) => {
          data.answers.forEach((answer) => {
            this.services.question.addQuestionAnswer({
              question_id: result.questionId,
              answer_id: answer.answer.answerId,
              is_correct: answer.isCorrect,
            });
          });
          return result;
        })
        .then((result) => {
          return this.services.question.getById(
            result.questionId,
            DefaultQuestionAdapterOptions
          );
        })
        .then(async (result) => {
          await this.services.question.commitChanges();
          res.send(result);
        })
        .catch(async (error) => {
          await this.services.question.rollbackChanges();
          res.status(400).send(error?.message);
        });
    });
  }

  edit(req: Request, res: Response) {
    const id: number = +req.params?.qid;
    const data = req.body as IEditQuestionDto;

    if (!EditQuestionValidator(data)) {
      return res.status(400).send(EditQuestionValidator.errors);
    }

    this.services.question.startTransaction().then(() => {
      this.services.question
        .getById(id, DefaultQuestionAdapterOptions)
        .then((result) => {
          if (result === null) {
            throw {
              status: 404,
              message: "The question is not found!",
            };
          }
        })
        .then(async () => {
          try {
            const date = new Date();
            const dateWithOffset = new Date(
              date.getTime() - date.getTimezoneOffset() * 60000
            );
            const question = await this.services.question.editById(id, {
              game_id: data.gameId,
              title: data.title,
              updated_at: dateWithOffset
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
            });
            await this.services.question.deleteQuestionAnswer(
              question.questionId
            );
            data.answers.forEach((answer) => {
              this.services.question.addQuestionAnswer({
                question_id: question.questionId,
                answer_id: answer.answer.answerId,
                is_correct: answer.isCorrect,
              });
            });
            await this.services.question.commitChanges();
            res.send(question);
          } catch (error) {
            throw {
              status: 400,
              message: error?.message,
            };
          }
        })
        .catch(async (error) => {
          await this.services.question.rollbackChanges();
          setTimeout(() => {
            res.status(error?.status ?? 500).send(error?.message);
          }, 500);
        });
    });
  }

  delete(req: Request, res: Response) {
    const id: number = +req.params?.qid;

    this.services.question.startTransaction().then(() => {
      this.services.question
        .getById(id, DefaultQuestionAdapterOptions)
        .then((result) => {
          if (result === null) {
            throw {
              status: 404,
              message: "The question is not found!",
            };
          }

          this.services.question
            .deleteQuestionAnswer(id)
            .then(() => {
              this.services.question.deleteById(id);
            })
            .then(async () => {
              await this.services.question.commitChanges();
              res.send("This question has been deleted!");
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
