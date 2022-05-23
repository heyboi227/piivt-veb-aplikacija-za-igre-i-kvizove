import * as mysql2 from "mysql2/promise";
import GameService from "../components/game/GameService.service";
import WordService from "../components/word/WordService.service";

export interface IServices {
  game: GameService;
  word: WordService;
}

export default interface IApplicationResources {
  databaseConnection: mysql2.Connection;
  services: IServices;
}
