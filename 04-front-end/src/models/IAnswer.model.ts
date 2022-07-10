export default interface IAnswer {
  answer: IAnswerModel;
  isCorrect: boolean;
  isActive: boolean;
}
export interface IAnswerModel {
  answerId: number;
  gameId: number;
  answerValue: string;
}
