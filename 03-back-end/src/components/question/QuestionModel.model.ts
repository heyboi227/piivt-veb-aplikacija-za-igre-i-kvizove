import IModel from "../../common/IModel.interface";
import AnswerModel from "../answer/AnswerModel.model";
import GameModel from "../game/GameModel.model";

export interface IQuestionAnswer {
  answer: AnswerModel;
  isCorrect: boolean;
  isActive: boolean;
}

class QuestionModel implements IModel {
  questionId: number;
  gameId: number;
  title: string;
  createdAt: string;
  updatedAt?: string;

  game?: GameModel = null;
  answers?: IQuestionAnswer[] = null;
}

export default QuestionModel;
