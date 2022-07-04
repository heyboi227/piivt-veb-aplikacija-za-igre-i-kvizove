export default interface IAnswer {
  answer: IAnswerModel;
  isCorrect: boolean;
}
export interface IAnswerModel {
  answerId: number;
  gameId: number;
  answerValue: string;
}
