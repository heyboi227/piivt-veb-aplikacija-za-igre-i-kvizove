import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IEditWord extends IServiceData {
  name: string;
}

interface IEditWordDto {
  name: string;
}

const EditWordSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 2,
      maxLength: 10,
    },
  },
  required: ["name"],
  additionalProperties: false,
};

const EditWordValidator = ajv.compile(EditWordSchema);

export { EditWordValidator, IEditWordDto };
