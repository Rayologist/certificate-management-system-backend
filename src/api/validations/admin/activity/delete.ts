import {object, string} from "yup";
import validate from "../../validator";

const schema = object({
  auid: string().uuid(),
});

const validateDeleteActivity = validate(schema);

export default validateDeleteActivity;
