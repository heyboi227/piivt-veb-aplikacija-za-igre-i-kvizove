import IAdapterOptions from "../../common/IAdapterOptions.interface";
import QuestionModel from "./QuestionModel.model";
import { IEditQuestionDto } from "./dto/IEditQuestion.dto";
import { IAddQuestionDto } from "./dto/IAddQuestion.dto";
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
    question.createdAt = data?.created_at;
    question.updatedAt = data?.updated_at;

    if (options.loadGame) {
      question.game = await this.services.game.getById(question.gameId, {});
    }

    if (options.showAnswers) { // TODO: create an answer component
      question.answers = await this.services.answer.getByQuestionId(
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

  public async add(data: IAddQuestionDto): Promise<QuestionModel> {
    return this.baseAdd(data, DefaultQuestionAdapterOptions);
  }

  public async editById(
    questionId: number,
    data: IEditQuestionDto
  ): Promise<QuestionModel> {
    return this.baseEditById(questionId, data, DefaultQuestionAdapterOptions);
  }

  public async deleteById(id: number): Promise<true> {
    return this.baseDeleteById(id);
  }
}
