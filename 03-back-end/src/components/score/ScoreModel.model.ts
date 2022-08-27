import IModel from "../../common/IModel.interface";
import UserModel from "../user/UserModel.model";

class ScoreModel implements IModel {
  scoreId: number;
  userId: number;
  value: number;

  user: UserModel = null;
    answers: any;
}

export default ScoreModel;
