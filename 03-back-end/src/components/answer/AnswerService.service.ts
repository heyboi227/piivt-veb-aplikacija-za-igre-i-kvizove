import IAdapterOptions from "../../common/IAdapterOptions.interface";
import BaseService from "../../common/BaseService";
import AnswerModel from "./AnswerModel.model";
import { IQuestionAnswer } from "../question/QuestionModel.model";
import { IQuestionAnswerDto } from "../question/dto/IAddQuestion.dto";

export class AnswerAdapterOptions implements IAdapterOptions {
  loadGame: boolean;
}

export const DefaultAnswerAdapterOptions: AnswerAdapterOptions = {
  loadGame: true,
};

export default class AnswerService extends BaseService<
  AnswerModel,
  AnswerAdapterOptions
> {
  tableName(): string {
    return "answer";
  }

  protected async adaptToModel(
    data: any,
    options: AnswerAdapterOptions
  ): Promise<AnswerModel> {
    const answer: AnswerModel = new AnswerModel();

    answer.answerId = +data?.answer_id;
    answer.gameId = +data?.game_id;
    answer.answerValue = data?.answer_value;

    if (options.loadGame) {
      answer.game = await this.services.game.getById(answer.gameId, {});
    }

    return answer;
  }

  public async getAllByQuestionId(
    questionId: number
  ): Promise<IQuestionAnswer[]> {
    return new Promise((resolve, reject) => {
      this.getAllFromTableByFieldNameAndValue<{
        question_answer_id: number;
        question_id: number;
        answer_id: number;
        is_correct: number;
      }>("question_answer", "question_id", questionId)
        .then(async (result) => {
          if (result.length === 0) {
            return resolve([]);
          }

          const items: IQuestionAnswer[] = await Promise.all(
            result.map(async (row) => {
              const answer = await this.getById(
                row.answer_id,
                DefaultAnswerAdapterOptions
              );

              return {
                answer: {
                  answerId: row.answer_id,
                  gameId: answer.gameId,
                  answerValue: answer.answerValue,
                },
                isCorrect: row.is_correct === 1,
              };
            })
          );

          resolve(items);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async addQuestionAnswer(data: IQuestionAnswerDto): Promise<number> {
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

  public async deleteQuestionAnswer(questionId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql: string =
        "DELETE FROM `question_answer` WHERE `question_id` = ?;";

      this.db
        .execute(sql, [questionId])
        .then(async (result) => {
          const info: any = result;
          resolve(+info[0]?.affectedRows);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
