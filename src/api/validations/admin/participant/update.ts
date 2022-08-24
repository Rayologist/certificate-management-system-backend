import { object, string, number } from "Yup";
import validate from "../../validator";

const schema = object({
  id: number().required(),
  name: string().required(),
  from: string().required(),
  title: string().required(),
  email: string().required(),
  phone: string().required(),
});

const validateUpdateParticipant = validate(schema);

export default validateUpdateParticipant;
