import IModel from "../../common/IModel.interface";
import GameModel from "../game/GameModel.model";

class QuestionModel implements IModel {
  questionId: number;
  gameId: number;
  createdAt: string;
  updatedAt?: string;

  game?: GameModel = null;
}

export default QuestionModel;
