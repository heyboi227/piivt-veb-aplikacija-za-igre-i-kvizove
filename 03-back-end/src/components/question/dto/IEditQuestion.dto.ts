import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IEditQuestion extends IServiceData {
  game_id: number;
  title: string;
}

interface IEditQuestionDto {
  gameId: number;
  title: string;
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
  },
  required: ["gameId", "title"],
  additionalProperties: false,
};

const EditQuestionValidator = ajv.compile(EditQuestionSchema);

export { EditQuestionValidator, IEditQuestionDto };
