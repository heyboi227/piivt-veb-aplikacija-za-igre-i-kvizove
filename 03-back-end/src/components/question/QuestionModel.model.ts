import IModel from "../../common/IModel.interface";
import AnswerModel from "../answer/AnswerModel.model";
import GameModel from "../game/GameModel.model";

class QuestionModel implements IModel {
  questionId: number;
  gameId: number;
  createdAt: string;
  updatedAt?: string;

  game?: GameModel = null;
  answers?: AnswerModel[] = null;
}

export default QuestionModel;
