import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IAddAnswer extends IServiceData {
  game_id: number;
  answer_value: string;
}

interface IAddAnswerDto {
  gameId: number;
  answerValue: string;
}

const AddAnswerSchema = {
  type: "object",
  properties: {
    gameId: {
      type: "number",
      minimum: 1,
      maximum: 4,
    },
    answerValue: {
      type: "string",
      minLength: 2,
      maxLength: 128,
    },
  },
  required: ["gameId", "answerValue"],
  additionalProperties: false,
};

const AddAnswerValidator = ajv.compile(AddAnswerSchema);

export { AddAnswerValidator, IAddAnswerDto };
