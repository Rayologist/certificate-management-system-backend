import { object, string, array } from "Yup";
import validate from "../../validator";

const schema = object({
  data: array().of(
    object({
      activityUid: string().required(),
      name: string().required(),
      from: string().required(),
      title: string().required(),
      email: string().required(),
      phone: string().required(),
    })
  ),
});

const validateCreateParticipant = validate(schema);

export default validateCreateParticipant;
