import { object, number } from "yup";
import validate from "../../validator";

const schema = object({
  id: number().required(),
});

const validateDeleteParticipant = validate(schema);

export default validateDeleteParticipant;
