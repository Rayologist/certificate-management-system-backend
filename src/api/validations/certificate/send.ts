import { object, string, number } from 'yup';
import validate from '../validator';

const schema = object({
  name: string().required(),
  email: string().required(),
  activityUid: string().uuid().required(),
  certificateId: number().required(),
});

const validateSendCertificate = validate(schema);

export default validateSendCertificate;
