import * as mysql2 from "mysql2/promise";
import GameService from "../components/game/GameService.service";
import UserService from "../components/user/UserService.service";
import WordService from "../components/word/WordService.service";

export interface IServices {
  game: GameService;
  word: WordService;
  user: UserService;
}

export default interface IApplicationResources {
  databaseConnection: mysql2.Connection;
  services: IServices;
}
