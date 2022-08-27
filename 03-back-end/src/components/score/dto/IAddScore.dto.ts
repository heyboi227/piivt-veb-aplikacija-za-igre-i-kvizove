import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IAddScore extends IServiceData {
  user_id: number;
  value: number;
}

export interface IAddScoreDto {
  userId: number;
  value: number;
}

const AddScoreSchema = {
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

const AddScoreValidator = ajv.compile(AddScoreSchema);

export { AddScoreValidator };
