import IAnswer from "./IAnswer.model";
import IGame from "./IGame.model";
import IUser from './IUser.model';

export default interface IQuestion {
  questionId: number;
  gameId: number;
  title: string;
  createdAt: string;
  updatedAt: string | null;
  game: IGame;
  answers: IAnswer[];
  user: IUser;
}
