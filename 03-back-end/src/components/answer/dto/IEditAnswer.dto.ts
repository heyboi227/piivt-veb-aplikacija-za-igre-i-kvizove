import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IEditAnswer extends IServiceData {
  game_id?: number;
  answer_value?: string;
}

interface IEditAnswerDto {
  gameId?: number;
  answerValue?: string;
}

const EditAnswerSchema = {
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
  required: [],
  additionalProperties: false,
};

const EditAnswerValidator = ajv.compile(EditAnswerSchema);

export { EditAnswerValidator, IEditAnswerDto };
