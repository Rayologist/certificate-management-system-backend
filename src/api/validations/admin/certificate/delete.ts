import { object, number } from 'yup';
import validate from '../../validator';

const schema = object({
  id: number().required(),
});

const validateDeleteCertificate = validate(schema);

export default validateDeleteCertificate;
