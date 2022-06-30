export default interface IQuestion {
  questionId: number;
  gameId: number;
  title: string;
  createdAt: string;
  updatedAt: string | null;
}
