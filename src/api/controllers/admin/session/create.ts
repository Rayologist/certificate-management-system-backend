import { Middleware } from '@koa/router';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ADMIN_COOKIE_NAME } from '@config';
import Cookies from 'cookies';

type RequestBody = {
  request: {
    body: {
      account: string;
      password: string;
    };
  };
};

const handleCreateSession: Middleware<{}, RequestBody> = async (ctx) => {
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

  const isProduction = process.env.NODE_ENV === 'production';

  const options: Cookies.SetOption = isProduction ? { sameSite: 'strict' } : {};
  const ONE_DAY = 24 * 60 * 60 * 1000;

  ctx.cookies.set(ADMIN_COOKIE_NAME, token, {
    maxAge: ONE_DAY,
    ...options,
  });

  ctx.body = { status: 'success', data: { role: 'admin' } };
};

export default handleCreateSession;
