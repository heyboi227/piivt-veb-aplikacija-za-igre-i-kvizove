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
  answers: {
    answer: {
      answerId: number;
      gameId: number;
      answerValue: string;
    };
    isCorrect: boolean;
  }[];
}

export interface IQuestionAnswerDto extends IServiceData {
  question_id: number;
  answer_id: number;
  is_correct: boolean;
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
    answers: {
      type: "array",
      minItems: 1,
      maxItems: 3,
      uniqueItems: true,
      items: {
        type: "object",
        properties: {
          answer: {
            type: "object",
            properties: {
              answerId: {
                type: "number",
              },
              gameId: {
                type: "number",
              },
              answerValue: {
                type: "string",
                minLength: 2,
                maxLength: 128,
              },
            },
            required: ["answerId", "gameId", "answerValue"],
            additionalProperties: false,
          },
          isCorrect: {
            type: "boolean",
          },
        },
        required: ["answer", "isCorrect"],
        additionalProperties: false,
      },
    },
  },
  required: ["gameId", "title", "answers"],
  additionalProperties: false,
};

const AddQuestionValidator = ajv.compile(AddQuestionSchema);

export { AddQuestionValidator, IAddQuestionDto };
