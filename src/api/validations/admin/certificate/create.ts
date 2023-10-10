import { object, string, array } from 'yup';
import validate from '../../validator';

const schema = object({
  activityUid: string().uuid().required(),
  displayName: string().required(),
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

const validateCreateCertificate = validate(schema);

export default validateCreateCertificate;
