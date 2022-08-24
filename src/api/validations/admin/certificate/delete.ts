import { object, number } from "Yup";
import validate from "../../validator";

const schema = object({
  id: number().required(),
});

const validateDeleteCertificate = validate(schema);

export default validateDeleteCertificate;
