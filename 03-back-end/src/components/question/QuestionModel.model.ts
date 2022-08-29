import IModel from "../../common/IModel.interface";
import AnswerModel from "../answer/AnswerModel.model";
import GameModel from "../game/GameModel.model";
import UserModel from "../user/UserModel.model";

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
  userId?: number;
  isCorrect: boolean;
  incorrectMessageReason?: string;

  game?: GameModel = null;
  answers?: IQuestionAnswer[] = null;
  user?: UserModel = null;
}

export default QuestionModel;
