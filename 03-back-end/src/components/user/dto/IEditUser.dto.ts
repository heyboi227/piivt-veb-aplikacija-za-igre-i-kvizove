import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IEditUser extends IServiceData {
  username: string;
  email: string;
  password_hash: string;
}

interface IEditUserDto {
  username: string;
  email: string;
  password: string;
}

const EditUserSchema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      pattern: "^[a-z-]{5,64}$",
    },
    email: {
      type: "string",
      pattern:
        "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$",
    },
    password: {
      type: "string",
      pattern: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$",
    },
  },
  required: ["username", "email", "password"],
  additionalProperties: false,
};

const EditUserValidator = ajv.compile(EditUserSchema);

export { EditUserValidator, IEditUserDto };
