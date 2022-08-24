import {object, string} from "Yup";
import validate from "../../validator";

const schema = object({
  auid: string().uuid(),
});

const validateDeleteActivity = validate(schema);

export default validateDeleteActivity;
