import IModel from "../../common/IModel.interface";
import GameModel from "../game/GameModel.model";

class AnswerModel implements IModel {
  answerId: number;
  gameId: number;
  answerValue: string;

  game?: GameModel = null;
}

export default AnswerModel;
