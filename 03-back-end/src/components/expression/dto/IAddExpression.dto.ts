import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IAddExpression extends IServiceData {
  value: string;
}

interface IAddExpressionDto {
  value: string;
}

const AddExpressionSchema = {
  type: "object",
  properties: {
    value: {
      type: "string",
    },
  },
  required: ["value"],
  additionalProperties: false,
};

const AddExpressionValidator = ajv.compile(AddExpressionSchema);

export { AddExpressionValidator, IAddExpressionDto };
