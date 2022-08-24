import path from "path";
import corsConfig from "./cors";

const ROOT = "/app";

// if (!ROOT) {
//   throw new Error("ROOT not found");
// }

const ROOT_FOLDER = path.resolve(ROOT, "certs");

const CERTIFICATE_ROOT = path.resolve(ROOT_FOLDER, "static");
const FONT_ROOT = path.resolve(ROOT_FOLDER, "fonts");
const TEMPLATE_PATH = path.resolve(ROOT_FOLDER, "template.png");
const ADMIN_COOKIE_NAME = "_s_a";
const CERT_COOKIE_NAME = "_c";

export {
  corsConfig,
  CERTIFICATE_ROOT,
  TEMPLATE_PATH,
  FONT_ROOT,
  ADMIN_COOKIE_NAME,
  CERT_COOKIE_NAME,
};
