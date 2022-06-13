import IAdapterOptions from "../../common/IAdapterOptions.interface";
import QuestionModel from "./QuestionModel.model";
import IEditQuestion from "./dto/IEditQuestion.dto";
import IAddQuestion from "./dto/IAddQuestion.dto";
import BaseService from "../../common/BaseService";

export class QuestionAdapterOptions implements IAdapterOptions {
  loadGame: boolean;
  showAnswers: boolean;
}

export const DefaultQuestionAdapterOptions: QuestionAdapterOptions = {
  loadGame: true,
  showAnswers: true,
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

    if (options.loadGame) {
      question.game = await this.services.game.getById(question.gameId, {});
    }

    if (options.showAnswers) {
      // TODO: create an answer component
      question.answers = await this.services.answer.getAllByQuestionId(
        question.questionId
      );
    }

    return question;
  }

  public async getAllByGameId(gameId: number): Promise<QuestionModel[]> {
    return this.getAllByFieldNameAndValue(
      "game_id",
      DefaultQuestionAdapterOptions,
      gameId
    );
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
    return new Promise((resolve) => {
      this.deleteAllAnswersByQuestionId(id)
        .then(() => this.baseDeleteById(id))
        .then(() => resolve(true));
    });
  }

  private async deleteAllAnswersByQuestionId(
    questionId: number
  ): Promise<true> {
    return new Promise((resolve) => {
      const sql = `DELETE FROM \`answer\` WHERE \`answer\`.question_id = ?;`;
      this.db
        .execute(sql, [questionId])
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          throw {
            message: error?.message ?? "Could not delete answers!",
          };
        });
    });
  }
}
