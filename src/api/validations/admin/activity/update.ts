import {object, string, date} from "yup";
import validate from "../../validator";

const schema = object({
  auid: string().uuid(),
  title: string().min(1),
  startDate: date(),
  endDate: date(),
});

const validateUpdateActivity = validate(schema);

export default validateUpdateActivity;
