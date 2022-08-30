import IAdapterOptions from "../../common/IAdapterOptions.interface";
import QuestionModel from "./QuestionModel.model";
import IEditQuestion from "./dto/IEditQuestion.dto";
import IAddQuestion, { IQuestionAnswer } from "./dto/IAddQuestion.dto";
import BaseService from "../../common/BaseService";
import * as mysql2 from "mysql2/promise";
import { DefaultUserAdapterOptions } from "../user/UserService.service";

export class QuestionAdapterOptions implements IAdapterOptions {
  showGame: boolean;
  showAnswers: boolean;
  showUser: boolean;
  hideInactiveAnswers: boolean;
}

export const DefaultQuestionAdapterOptions: QuestionAdapterOptions = {
  showGame: true,
  showAnswers: true,
  showUser: true,
  hideInactiveAnswers: true,
};

export default class QuestionService extends BaseService<
  QuestionModel,
  QuestionAdapterOptions
> {
  tableName(): string {
    return "question";
  }

  protected async adaptToModel(
    data: any,
    options: QuestionAdapterOptions = DefaultQuestionAdapterOptions
  ): Promise<QuestionModel> {
    const question: QuestionModel = new QuestionModel();

    question.questionId = +data?.question_id;
    question.gameId = +data?.game_id;
    question.title = data?.title;
    question.createdAt = data?.created_at;
    question.updatedAt = data?.updated_at;
    question.userId = +data?.user_id;
    question.isCorrect = +data?.is_correct === 1;
    question.incorrectMessageReason = data?.incorrect_message_reason;

    if (options.showGame) {
      question.game = await this.services.game.getById(question.gameId, {});
    }

    if (options.showUser) {
      question.user = await this.services.user.getById(question.userId, {
        removeActivationCode: true,
        removeEmail: false,
        removePassword: true,
      });
    }

    if (options.showAnswers) {
      question.answers = await this.services.answer.getAllByQuestionId(
        question.questionId
      );

      if (options.hideInactiveAnswers) {
        question.answers = question.answers.filter(
          (answerInfo) => answerInfo.isActive
        );
      }
    }

    return question;
  }

  public async getAllByGameId(gameId: number): Promise<QuestionModel[]> {
    return new Promise<QuestionModel[]>((resolve, reject) => {
      const sql: string = `SELECT * FROM \`question\` WHERE \`game_id\` = ${gameId} ORDER BY RAND();`;

      this.db
        .execute(sql, [gameId])
        .then(async ([rows]) => {
          if (rows === undefined) {
            return resolve([]);
          }

          const items: QuestionModel[] = [];

          for (const row of rows as mysql2.RowDataPacket[]) {
            items.push(
              await this.adaptToModel(row, DefaultQuestionAdapterOptions)
            );
          }

          resolve(items);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async getAllByUserId(userId: number): Promise<QuestionModel[]> {
    return new Promise<QuestionModel[]>((resolve, reject) => {
      const sql: string = `SELECT * FROM \`question\` WHERE \`user_id\` = ${userId};`;

      this.db
        .execute(sql, [userId])
        .then(async ([rows]) => {
          if (rows === undefined) {
            return resolve([]);
          }

          const items: QuestionModel[] = [];

          for (const row of rows as mysql2.RowDataPacket[]) {
            items.push(
              await this.adaptToModel(row, DefaultQuestionAdapterOptions)
            );
          }

          resolve(items);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async add(data: IAddQuestion): Promise<QuestionModel> {
    return this.baseAdd(data, DefaultQuestionAdapterOptions);
  }

  public async editById(
    questionId: number,
    data: IEditQuestion
  ): Promise<QuestionModel> {
    return this.baseEditById(questionId, data, DefaultQuestionAdapterOptions);
  }

  public async deleteById(id: number): Promise<true> {
    return this.baseDeleteById(id);
  }

  public async addQuestionAnswer(data: IQuestionAnswer): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql: string =
        "INSERT `question_answer` SET `question_id` = ?, `answer_id` = ?, `is_correct` = ?;";

      this.db
        .execute(sql, [data.question_id, data.answer_id, data.is_correct])
        .then(async (result) => {
          const info: any = result;
          resolve(+info[0]?.insertId);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async editQuestionAnswer(data: IQuestionAnswer): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql: string =
        "UPDATE `question_answer` SET `is_correct` = ? WHERE question_id = ? AND answer_id = ?;";

      this.db
        .execute(sql, [data.is_correct, data.question_id, data.answer_id])
        .then(async (result) => {
          const info: any = result;
          resolve(+info[0]?.affectedRows);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async deleteAllQuestionAnswersByQuestionId(
    questionId: number
  ): Promise<true> {
    return new Promise((resolve, reject) => {
      const sql: string =
        "DELETE FROM `question_answer` WHERE `question_id` = ?;";

      this.db
        .execute(sql, [questionId])
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          throw {
            message: error?.message ?? "Could not delete question answers!",
          };
        });
    });
  }
}
