import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IAddQuestion extends IServiceData {
  game_id: number;
  title: string;
  user_id: number;
}

export interface IAddQuestionDto {
  gameId: number;
  title: string;
  answers: {
    answerId: number;
    isCorrect: boolean;
    isActive: boolean;
  }[];
  userId: number;
}

export interface IQuestionAnswer extends IServiceData {
  question_id: number;
  answer_id: number;
  is_correct: number;
  is_active?: number;
}

const AddQuestionSchema = {
  type: "object",
  properties: {
    gameId: {
      type: "number",
      minimum: 1,
      maximum: 4,
    },
    title: {
      type: "string",
      minLength: 2,
      maxLength: 128,
    },
    answers: {
      type: "array",
      minItems: 1,
      uniqueItems: true,
      items: {
        type: "object",
        properties: {
          answerId: {
            type: "integer",
          },
          isCorrect: {
            type: "boolean",
          },
        },
        required: ["answerId", "isCorrect"],
        additionalProperties: false,
      },
    },
    userId: {
      type: "number",
    },
  },
  required: ["gameId", "title", "answers", "userId"],
  additionalProperties: false,
};

const AddQuestionValidator = ajv.compile(AddQuestionSchema);

export { AddQuestionValidator };
