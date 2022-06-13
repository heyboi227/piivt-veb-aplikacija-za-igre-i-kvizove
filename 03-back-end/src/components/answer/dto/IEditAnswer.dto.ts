import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IEditAnswer extends IServiceData {
  question_id: number;
  answer_value: string;
  is_correct: boolean;
}

interface IEditAnswerDto {
  questionId: number;
  answerValue: string;
  isCorrect: boolean;
}

const EditAnswerSchema = {
  type: "object",
  properties: {
    questionId: {
      type: "number",
      minimum: 3,
      maximum: 4,
    },
    answerValue: {
      type: "string",
      minLength: 2,
      maxLength: 128,
    },
    isCorrect: {
      type: "boolean",
    },
  },
  required: ["questionId", "answerValue", "isCorrect"],
  additionalProperties: false,
};

const EditAnswerValidator = ajv.compile(EditAnswerSchema);

export { EditAnswerValidator, IEditAnswerDto };
