import { object, string, array } from "yup";
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

const validateCreateParticipant = validate(schema, (errors) => {
  const path = errors.path?.split(".");
  const { data } = errors.value;
  let errorValue;
  if (Array.isArray(path)) {
    const index = Number(path[0].replace(/data\[(\d+)\]/g, "$1"));
    if (!Number.isNaN(index)) {
      if (path[1]) {
        errorValue = data[index];
      }
    }
  }
  return { value: errorValue };
});

export default validateCreateParticipant;
