import { object, string, array, number } from 'yup';
import validate from '../../validator';

const schema = object({
  activityUid: string().uuid().required(),
  displayName: string().required(),
  title: array()
    .of(
      object({
        text: string().required(),
        weight: string(),
      }),
    )
    .required()
    .min(1)
    .max(3),
  totalHour: number().required(),
  dateString: string().min(1).required(),
});

const validateCreateCertificate = validate(schema);

export default validateCreateCertificate;
