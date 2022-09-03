import { Middleware } from '@koa/router';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ADMIN_COOKIE_NAME } from '@config';

const handleCreateSession: Middleware = async (ctx) => {
  const { account, password } = ctx.request.body;
  const { ACCOUNT, PASSWORD, JWT_SECRET } = process.env;
  if (!(ACCOUNT && PASSWORD && JWT_SECRET)) {
    ctx.status = 500;
    ctx.body = { status: 'failed' };
    return;
  }
  if (account !== ACCOUNT) {
    ctx.body = { status: 'failed' };
    ctx.status = 401;
    return;
  }
  const isValidPassword = await bcrypt.compare(password, PASSWORD);
  if (!isValidPassword) {
    ctx.body = { status: 'failed' };
    ctx.status = 401;
    return;
  }

  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, {
    expiresIn: '1 days',
  });

  ctx.cookies.set(ADMIN_COOKIE_NAME, token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  ctx.body = { status: 'success', data: { role: 'admin' } };
};

export default handleCreateSession;
