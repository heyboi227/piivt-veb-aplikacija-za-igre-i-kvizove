import * as mysql2 from "mysql2/promise";
import GameService from "../components/game/GameService.service";
import UserService from "../components/user/UserService.service";
import WordService from "../components/word/WordService.service";
import CountryService from "../components/country/CountryService.service";
import ExpressionService from "../components/expression/ExpressionService.service";
import QuestionService from "../components/question/QuestionService.service";
import AnswerService from "../components/answer/AnswerService.service";

export interface IServices {
  game: GameService;
  word: WordService;
  user: UserService;
  country: CountryService;
  expression: ExpressionService;
  question: QuestionService;
  answer: AnswerService;
}

export default interface IApplicationResources {
  databaseConnection: mysql2.Connection;
  services: IServices;
}
