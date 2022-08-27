import IModel from "../../common/IModel.interface";
import UserModel from "../user/UserModel.model";

class ScoreModel implements IModel {
  scoreId: number;
  userId: number;
  value: number;
  createdAt: string;

  user: UserModel = null;
}

export default ScoreModel;
