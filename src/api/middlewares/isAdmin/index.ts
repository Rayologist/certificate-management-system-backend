import { Middleware } from "@koa/router";

const isAdmin = (): Middleware => async (ctx, next) => {
  if (!Object.keys(ctx.session).length) {
    ctx.status = 401;
    return;
  }

  if (ctx.session.role !== "admin") {
    ctx.status = 403;
    return;
  }
  await next();
};

export default isAdmin;
