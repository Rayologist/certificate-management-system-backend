import { Middleware } from '@koa/router';
import { ADMIN_COOKIE_NAME } from '@config';

const handleDeleteSession: Middleware = async (ctx) => {
  ctx.cookies.set(ADMIN_COOKIE_NAME, null);
  ctx.status = 200;
};

export default handleDeleteSession;
