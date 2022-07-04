import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import { DefaultQuestionAdapterOptions } from "./QuestionService.service";
import { DefaultAnswerAdapterOptions } from "../answer/AnswerService.service";
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
    const questionId: number = +req.params?.qid;

    this.services.question
      .getById(questionId, DefaultQuestionAdapterOptions)
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

    this.services.answer
      .getAll(DefaultAnswerAdapterOptions)
      .then((answers) => {
        const availableAnswerIds: number[] = answers.map(
          (answer) => answer.answerId
        );

        for (let givenAnswerInformation of data.answers) {
          if (!availableAnswerIds.includes(givenAnswerInformation.answerId)) {
            throw {
              status: 404,
              message: `Answer with ID ${givenAnswerInformation.answerId} not found!`,
            };
          }
        }
      })
      .then(() => {
        return this.services.question.startTransaction();
      })
      .then(() => {
        return this.services.question.add({
          game_id: data.gameId,
          title: data.title,
        });
      })
      .then((newQuestion) => {
        for (let givenAnswerInformation of data.answers) {
          this.services.question
            .addQuestionAnswer({
              question_id: newQuestion.questionId,
              answer_id: givenAnswerInformation.answerId,
              is_correct: givenAnswerInformation.isCorrect,
            })
            .catch((error) => {
              throw {
                status: 500,
                message: error?.message,
              };
            });
        }

        return newQuestion;
      })
      .then((newQuestion) => {
        return this.services.question.getById(
          newQuestion.questionId,
          DefaultQuestionAdapterOptions
        );
      })
      .then(async (result) => {
        await this.services.question.commitChanges();
        res.send(result);
      })
      .catch(async (error) => {
        await this.services.question.rollbackChanges();
        res.status(error?.status ?? 500).send(error?.message);
      });
  }

  edit(req: Request, res: Response) {
    const questionId: number = +req.params?.qid;
    const data = req.body as IEditQuestionDto;

    if (!EditQuestionValidator(data)) {
      return res.status(400).send(EditQuestionValidator.errors);
    }

    this.services.question.startTransaction().then(() => {
      this.services.question
        .getById(questionId, DefaultQuestionAdapterOptions)
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
            const question = await this.services.question.editById(questionId, {
              game_id: data.gameId,
              title: data.title,
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
    const questionId: number = +req.params?.qid;

    this.services.question.startTransaction().then(() => {
      this.services.question
        .getById(questionId, DefaultQuestionAdapterOptions)
        .then((result) => {
          if (result === null) {
            throw {
              status: 404,
              message: "The question is not found!",
            };
          }

          this.services.question
            .deleteAllQuestionAnswersByQuestionId(questionId)
            .then(() => {
              this.services.question.deleteById(questionId);
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
