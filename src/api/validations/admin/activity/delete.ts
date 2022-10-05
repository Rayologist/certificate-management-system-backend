import { object, string } from 'yup';
import validate from '../../validator';

const schema = object({
  auid: string().uuid().required(),
});

const validateDeleteActivity = validate(schema);

export default validateDeleteActivity;
