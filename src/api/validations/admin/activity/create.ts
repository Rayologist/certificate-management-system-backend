import { object, string, date } from 'yup';
import validate from '../../validator';

const schema = object({
  title: string().min(1).required(),
  startDate: date().required(),
  endDate: date().required(),
  subject: string().required(),
  email: string().required(),
});

const validateCreateActivity = validate(schema);

export default validateCreateActivity;
