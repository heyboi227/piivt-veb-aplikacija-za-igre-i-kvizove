import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IAddQuestion extends IServiceData {
  gameId: number;
}

interface IAddQuestionDto {
  gameId: number;
}

const AddQuestionSchema = {
  type: "object",
  properties: {
    gameId: {
      type: "number",
    },
  },
  required: ["gameId"],
  additionalProperties: false,
};

const AddQuestionValidator = ajv.compile(AddQuestionSchema);

export { AddQuestionValidator, IAddQuestionDto };
