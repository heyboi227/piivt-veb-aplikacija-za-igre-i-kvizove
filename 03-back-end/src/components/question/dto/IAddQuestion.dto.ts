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

export { AddQuestionValidator, IAddQuestionDto };
