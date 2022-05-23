import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IAddUser extends IServiceData {
  username: string;
  email: string;
  password_hash: string;
}

interface IAddUserDto {
  username: string;
  email: string;
  password: string;
}

const AddUserSchema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      pattern: "^[a-z-]{5,64}$",
    },
    email: {
      type: "string",
      pattern:
        "^(?=.*[a-z])(?=.*[A-Z]).@(?=.*[a-z])(?=.*[A-Z])..(?=.*[a-z])(?=.*[A-Z]).",
    },
    password: {
      type: "string",
      pattern: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$",
    },
  },
  required: ["username"],
  additionalProperties: false,
};

const AddUserValidator = ajv.compile(AddUserSchema);

export { AddUserValidator, IAddUserDto };
