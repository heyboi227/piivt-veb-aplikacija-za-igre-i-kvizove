import GameModel from "./GameModel.model";

class GameService {
  public async getAll(): Promise<GameModel[]> {
    const games: GameModel[] = [];

    games.push(
      {
        gameId: 1,
        name: "Pronađi najdužu reč",
      },
      {
        gameId: 2,
        name: "Pogodi državu",
      },
      {
        gameId: 3,
        name: "Pogodi zastavu",
      },
      {
        gameId: 4,
        name: "Izračunaj izraz",
      }
    );

    return games;
  }

  public async getById(gameId: number): Promise<GameModel> | null {
    if (gameId === 5) {
      return null;
    }
    return {
      gameId: 2,
      name: "Game " + gameId + " name",
    };
  }
}

export default GameService;
