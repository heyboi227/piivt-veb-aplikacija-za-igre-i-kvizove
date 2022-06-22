import Ajv from "ajv";
import useFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();
useFormats(ajv);

export default interface IEditUser extends IServiceData {
  username?: string;
  is_active?: number;
}

interface IEditUserDto {
  username?: string;
  isActive?: boolean;
}

const EditUserSchema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      pattern: "^[0-9A-Za-z-]{5,64}$",
    },
  },
  required: ["username"],
  additionalProperties: false,
};

const EditUserValidator = ajv.compile(EditUserSchema);

export { EditUserValidator, IEditUserDto };
