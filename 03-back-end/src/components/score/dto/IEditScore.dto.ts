import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IEditScore extends IServiceData {
  user_id: number;
  value: number;
}

export interface IEditScoreDto {
  userId: number;
  value: number;
}

const EditScoreSchema = {
  type: "object",
  properties: {
    userId: {
      type: "number",
    },
    value: {
      type: "number",
    },
  },
  required: ["userId", "value"],
  additionalProperties: false,
};

const EditScoreValidator = ajv.compile(EditScoreSchema);

export { EditScoreValidator };
