import * as mysql2 from "mysql2/promise";
import GameService from "../components/game/GameService.service";
import UserService from "../components/user/UserService.service";
import QuestionService from "../components/question/QuestionService.service";
import AnswerService from "../components/answer/AnswerService.service";
import AdministratorService from "../components/administrator/AdministratorService.service";
import ScoreService from "../components/score/ScoreService.service";

export interface IServices {
  answer: AnswerService;
  administrator: AdministratorService;
  game: GameService;
  question: QuestionService;
  score: ScoreService;
  user: UserService;
}

export default interface IApplicationResources {
  databaseConnection: mysql2.Connection;
  services: IServices;
}
