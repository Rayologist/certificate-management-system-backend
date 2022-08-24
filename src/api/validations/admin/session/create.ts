import { object, string } from "yup";
import validate from "../../validator";

const schema = object({
  account: string().required(),
  password: string().required(),
});

const validateCreateSession = validate(schema);

export default validateCreateSession;
