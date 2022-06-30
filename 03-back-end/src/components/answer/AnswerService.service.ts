import IAdapterOptions from "../../common/IAdapterOptions.interface";
import BaseService from "../../common/BaseService";
import AnswerModel from "./AnswerModel.model";
import { IQuestionAnswer } from "../question/QuestionModel.model";
import IAddAnswer from "./dto/IAddAnswer.dto";
import IEditAnswer from "./dto/IEditAnswer.dto";

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

  public async add(data: IAddAnswer): Promise<AnswerModel> {
    return this.baseAdd(data, DefaultAnswerAdapterOptions);
  }

  public async editById(
    questionId: number,
    data: IEditAnswer
  ): Promise<AnswerModel> {
    return this.baseEditById(questionId, data, DefaultAnswerAdapterOptions);
  }

  public async deleteById(id: number): Promise<true> {
    return this.baseDeleteById(id);
  }
}
