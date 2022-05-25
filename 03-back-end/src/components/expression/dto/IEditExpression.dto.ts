import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IEditExpression extends IServiceData {
  value: string;
}

interface IEditExpressionDto {
  value: string;
}

const EditExpressionSchema = {
  type: "object",
  properties: {
    value: {
      type: "string",
    },
  },
  required: ["value"],
  additionalProperties: false,
};

const EditExpressionValidator = ajv.compile(EditExpressionSchema);

export { EditExpressionValidator, IEditExpressionDto };
