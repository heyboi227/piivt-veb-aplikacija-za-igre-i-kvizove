import * as mysql2 from "mysql2/promise";
import GameService from "../components/game/GameService.service";
import UserService from "../components/user/UserService.service";
import WordService from "../components/word/WordService.service";
import CountryService from "../components/country/CountryService.service";

export interface IServices {
  game: GameService;
  word: WordService;
  user: UserService;
  country: CountryService;
}

export default interface IApplicationResources {
  databaseConnection: mysql2.Connection;
  services: IServices;
}
