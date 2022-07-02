import IAnswer from "./IAnswer.model";

export default interface IQuestionAnswer {
    answer: IAnswer;
    isCorrect: boolean;
}