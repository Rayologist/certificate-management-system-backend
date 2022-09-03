import { Middleware } from '@koa/router';
import { prisma } from '@models';
import { createHash } from 'crypto';

type Payload = {
  title: string;
  startDate: Date;
  endDate: Date;
};

const handleCreateActivity: Middleware = async (ctx) => {
  const { title, startDate, endDate } = ctx.request.body as Payload;

  // generate url
  const hash = createHash('sha256');
  hash.update(JSON.stringify(ctx.body) + new Date().toString());
  const url = hash.digest('base64url');

  await prisma.activity.create({
    data: {
      title,
      startDate,
      endDate,
      url,
    },
  });
  ctx.status = 201;
  ctx.body = { status: 'success' };
};

export default handleCreateActivity;
