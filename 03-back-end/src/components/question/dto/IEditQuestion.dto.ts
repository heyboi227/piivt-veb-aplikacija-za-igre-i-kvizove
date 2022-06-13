import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IEditQuestion extends IServiceData {
  game_id: number;
}

interface IEditQuestionDto {
  gameId: number;
}

const EditQuestionSchema = {
  type: "object",
  properties: {
    gameId: {
      type: "number",
    },
  },
  required: ["gameId"],
  additionalProperties: false,
};

const EditQuestionValidator = ajv.compile(EditQuestionSchema);

export { EditQuestionValidator, IEditQuestionDto };
