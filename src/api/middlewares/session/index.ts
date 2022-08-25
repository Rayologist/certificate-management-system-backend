import * as jwt from "jsonwebtoken";
import { Middleware } from "@koa/router";
import { ADMIN_COOKIE_NAME } from "@config";

const verifyJWT = async (token: string, secret: string) => {
  try {
    const validToken = jwt.verify(token, secret);
    return validToken;
  } catch (error) {
    return false;
  }
};

const session = (): Middleware => async (ctx, next) => {
  const token = ctx.cookies.get(ADMIN_COOKIE_NAME);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    ctx.status = 500;
    return;
  }

  if (!token) {
    ctx.session = {};
    await next();
    return;
  }

  const validToken = await verifyJWT(token, secret);

  if (!validToken) {
    ctx.session = {};
    ctx.cookies.set(ADMIN_COOKIE_NAME, null);

    await next();
    return;
  }

  ctx.session = validToken;

  await next();
};

export default session;
