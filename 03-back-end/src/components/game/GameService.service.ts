import GameModel from "./GameModel.model";
import * as mysql2 from "mysql2/promise";

class GameService {
  private db: mysql2.Connection;

  constructor(databaseConnection: mysql2.Connection) {
    this.db = databaseConnection;
  }

  private async adaptToModel(data: any): Promise<GameModel> {
    const game: GameModel = new GameModel();

    game.gameId = +data?.game_id;
    game.name = data?.name;

    return game;
  }

  public async getAll(): Promise<GameModel[]> {
    return new Promise<GameModel[]>((resolve, reject) => {
      const games: GameModel[] = [];

      const sql: string = "SELECT * FROM `game`;";
      this.db
        .execute(sql)
        .then(async ([rows]) => {
          if (rows === undefined) {
            return resolve([]);
          }

          const games: GameModel[] = [];

          for (const row of rows as mysql2.RowDataPacket[]) {
            games.push(await this.adaptToModel(row));
          }

          resolve(games);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async getById(gameId: number): Promise<GameModel> | null {
    return new Promise<GameModel>((resolve, reject) => {
      const sql: string = "SELECT * FROM game WHERE game_id = ?;";

      this.db
        .execute(sql, [gameId])
        .then(async ([rows]) => {
          if (rows === undefined) {
            return resolve(null);
          }

          if (Array.isArray(rows) && rows.length === 0) {
            return resolve(null);
          }

          resolve(await this.adaptToModel(rows[0]));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default GameService;
