import Ajv from "ajv";

const ajv = new Ajv();

export default interface IAddWord {
  name: string;
}

const AddWordSchema = {
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

const AddWordValidator = ajv.compile(AddWordSchema);

export { AddWordValidator };
