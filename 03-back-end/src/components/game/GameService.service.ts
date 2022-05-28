import GameModel from "./GameModel.model";
import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";

export class GameAdapterOptions implements IAdapterOptions {}

class GameService extends BaseService<GameModel, GameAdapterOptions> {
  tableName(): string {
    return "game";
  }

  protected async adaptToModel(data: any): Promise<GameModel> {
    const game: GameModel = new GameModel();

    game.gameId = +data?.game_id;
    game.name = data?.name;

    return game;
  }

  public async getByName(name: string): Promise<GameModel> {
    return this.getByFieldNameAndValue("name", {}, name);
  }
}

export default GameService;
