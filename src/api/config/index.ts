import path from 'path';
import corsConfig from './cors';

const { ROOT } = process.env;

if (!ROOT) {
  throw new Error('ROOT not found');
}

const PREFIX = process.env.NODE_ENV === 'production' ? '/api' : '/';

const ROOT_FOLDER = path.resolve(ROOT, 'certs');
const CERTIFICATE_ROOT = path.resolve(ROOT_FOLDER, 'static');
const FONT_ROOT = path.resolve(ROOT_FOLDER, 'fonts');
const TEMPLATE_PATH = path.resolve(ROOT_FOLDER, 'templates');
const ADMIN_COOKIE_NAME = '_s_a';
const CERT_COOKIE_NAME = '_c';
const TEMPLATE_ID = 2;

const Email = {
  from: '國立臺灣大學雙語教育中心 <ntucbe@ntu.edu.tw>',
} as const;

export {
  corsConfig,
  CERTIFICATE_ROOT,
  PREFIX,
  TEMPLATE_PATH,
  FONT_ROOT,
  ADMIN_COOKIE_NAME,
  CERT_COOKIE_NAME,
  Email,
  TEMPLATE_ID,
};
