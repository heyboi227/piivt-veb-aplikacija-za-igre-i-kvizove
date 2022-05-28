import GameModel from "./GameModel.model";
import BaseService from "../../common/BaseService";

class GameService extends BaseService<GameModel> {
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
    return this.getByFieldNameAndValue("name", name);
  }
}

export default GameService;
