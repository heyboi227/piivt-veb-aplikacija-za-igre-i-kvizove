import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IEditQuestion extends IServiceData {
  game_id: number;
  title: string;
  updated_at: string;
}

interface IEditQuestionDto {
  gameId: number;
  title: string;
  answers: {
    answer: {
      answerId: number;
    };
    isCorrect: boolean;
  }[];
}

const EditQuestionSchema = {
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
            required: ["answerId"],
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

const EditQuestionValidator = ajv.compile(EditQuestionSchema);

export { EditQuestionValidator, IEditQuestionDto };
