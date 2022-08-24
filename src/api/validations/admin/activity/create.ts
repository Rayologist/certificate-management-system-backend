import { object, string, date } from "Yup";
import validate from "../../validator";

const schema = object({
  title: string().min(1).required(),
  startDate: date().required(),
  endDate: date().required(),
});

const validateCreateActivity = validate(schema);

export default validateCreateActivity;
