import { object, string, array, number } from "Yup";
import validate from "../../validator";

const schema = object({
  id: number().required(),
  title: array()
    .of(
      object({
        text: string().required(),
        weight: string(),
      })
    )
    .required()
    .min(1)
    .max(3),
  totalHour: number().required(),
  dateString: string().min(1).required(),
});

const validateUpdateCertificate = validate(schema);

export default validateUpdateCertificate;
