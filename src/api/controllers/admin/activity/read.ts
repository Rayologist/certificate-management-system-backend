import { prisma } from '@models';
import { Middleware } from '@koa/router';

const handleGetActivity: Middleware = async (ctx) => {
  const data = await prisma.activity.findMany();
  ctx.body = { status: 'success', data };
};

export default handleGetActivity;
