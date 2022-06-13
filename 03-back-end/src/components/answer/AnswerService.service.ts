import IAdapterOptions from "../../common/IAdapterOptions.interface";
import BaseService from "../../common/BaseService";
import AnswerModel from "./AnswerModel.model";
import IAddAnswer from "./dto/IAddAnswer.dto";
import IEditAnswer from "./dto/IEditAnswer.dto";

export class AnswerAdapterOptions implements IAdapterOptions {
  loadQuestion: boolean;
}

export const DefaultAnswerAdapterOptions: AnswerAdapterOptions = {
  loadQuestion: false,
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
    answer.questionId = +data?.question_id;
    answer.answerValue = data?.answer_value;
    answer.isCorrect = +data?.is_correct === 1;

    if (options.loadQuestion) {
      answer.question = await this.services.question.getById(
        answer.questionId,
        {
          loadGame: true,
          showAnswers: false,
        }
      );
    }

    return answer;
  }

  public async getAllByQuestionId(questionId: number) {
    return this.getAllByFieldNameAndValue(
      "question_id",
      DefaultAnswerAdapterOptions,
      questionId
    );
  }

  public async add(data: IAddAnswer): Promise<AnswerModel> {
    return this.baseAdd(data, DefaultAnswerAdapterOptions);
  }

  public async editById(answerId: number, data: IEditAnswer): Promise<AnswerModel> {
    return this.baseEditById(answerId, data, DefaultAnswerAdapterOptions);
  }

  public async deleteById(answerId: number) {
    return this.baseDeleteById(answerId);
  }
}
