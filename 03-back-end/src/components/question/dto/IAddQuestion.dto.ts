import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IAddQuestion extends IServiceData {
  game_id: number;
  title: string;
}

interface IAddQuestionDto {
  gameId: number;
  title: string;
}

export interface IQuestionAnswer extends IServiceData {
  question_id: number;
  answer_id: number;
  is_correct?: boolean;
}

interface IQuestionAnswerDto {
  questionId: number;
  answerId: number;
  isCorrect: boolean;
}

const AddQuestionSchema = {
  type: "object",
  properties: {
    gameId: {
      type: "number",
      minimum: 3,
      maximum: 4,
    },
    title: {
      type: "string",
      minLength: 2,
      maxLength: 128,
    },
  },
  required: ["gameId", "title"],
  additionalProperties: false,
};

const AddQuestionValidator = ajv.compile(AddQuestionSchema);

export { AddQuestionValidator, IAddQuestionDto, IQuestionAnswerDto };
