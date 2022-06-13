import IModel from "../../common/IModel.interface";
import QuestionModel from "../question/QuestionModel.model";

class AnswerModel implements IModel {
  answerId: number;
  questionId: number;
  answerValue: string;
  isCorrect: boolean;

  question?: QuestionModel = null;
}

export default AnswerModel;
