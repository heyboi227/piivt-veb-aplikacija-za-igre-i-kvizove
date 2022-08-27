import IAdapterOptions from "../../common/IAdapterOptions.interface";
import ScoreModel from "./ScoreModel.model";
import IAddScore from "./dto/IAddScore.dto";
import BaseService from "../../common/BaseService";

export class ScoreAdapterOptions implements IAdapterOptions {
  showUser: boolean;
}

export const DefaultScoreAdapterOptions: ScoreAdapterOptions = {
  showUser: true,
};

export default class ScoreService extends BaseService<
  ScoreModel,
  ScoreAdapterOptions
> {
  tableName(): string {
    return "score";
  }

  protected async adaptToModel(
    data: any,
    options: ScoreAdapterOptions = DefaultScoreAdapterOptions
  ): Promise<ScoreModel> {
    const score: ScoreModel = new ScoreModel();

    score.scoreId = +data?.score_id;
    score.userId = +data?.user_id;
    score.value = +data?.value;
    score.createdAt = data?.created_at;

    if (options.showUser) {
      score.user = await this.services.user.getById(score.userId, {
        removePassword: true,
        removeEmail: false,
        removeActivationCode: true,
      });
    }

    return score;
  }

  public async getAllByUserId(userId: number): Promise<ScoreModel[]> {
    return this.getAllByFieldNameAndValue(
      "user_id",
      DefaultScoreAdapterOptions,
      userId
    );
  }

  public async add(data: IAddScore): Promise<ScoreModel> {
    return this.baseAdd(data, DefaultScoreAdapterOptions);
  }

  public async deleteById(id: number): Promise<true> {
    return this.baseDeleteById(id);
  }
}
