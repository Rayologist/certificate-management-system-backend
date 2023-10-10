import { object, string, array, number } from 'yup';
import validate from '../../validator';

const schema = object({
  id: number().required(),
  content: array()
    .of(
      object({
        text: string().required(),
        weight: string(),
      }),
    )
    .required()
    .min(1),
});

const validateUpdateCertificate = validate(schema);

export default validateUpdateCertificate;
