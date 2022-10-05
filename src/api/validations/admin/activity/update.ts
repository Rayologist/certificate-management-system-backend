import { object, string, date } from 'yup';
import validate from '../../validator';

const schema = object({
  auid: string().uuid().required(),
  title: string().min(1),
  startDate: date().required(),
  endDate: date().required(),
  subject: string().required(),
  email: string().required(),
});

const validateUpdateActivity = validate(schema);

export default validateUpdateActivity;
