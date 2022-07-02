import IGame from "./IGame.model";
import IQuestionAnswer from "./IQuestionAnswer.model";

export default interface IQuestion {
  questionId: number;
  gameId: number;
  title: string;
  createdAt: string;
  updatedAt: string | null;
  game: IGame;
  answers: IQuestionAnswer[];
}
