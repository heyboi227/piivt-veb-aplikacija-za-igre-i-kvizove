import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IEditQuestion extends IServiceData {
  game_id?: number;
  title?: string;
  user_id?: number;
  is_correct?: number;
  incorrect_message_reason?: string;
}

interface IEditQuestionDto {
  gameId?: number;
  title?: string;
  answers?: {
    answerId: number;
    isCorrect: boolean;
    isActive: boolean;
  }[];
  userId?: number;
  isCorrect?: boolean;
  incorrectMessageReason?: string;
}

const EditQuestionSchema = {
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
    isCorrect: {
      type: "boolean",
    },
    incorrectMessageReason: {
      type: "string",
    },
  },
  required: [],
  additionalProperties: false,
};

const EditQuestionValidator = ajv.compile(EditQuestionSchema);

export { EditQuestionValidator, IEditQuestionDto };
