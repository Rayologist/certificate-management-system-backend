import { Middleware } from '@koa/router';
import { prisma } from '@models';

type Payload = {
  auid: string;
  title: string;
  startDate: Date;
  endDate: Date;
  email: string;
  subject: string;
};

const handleUpdateActivity: Middleware = async (ctx) => {
  // TODO: Fix the update problem when the value in where clause does not exist

  const { auid, title, startDate, endDate, email, subject } = ctx.request.body as Payload;

  await prisma.activity.update({
    where: {
      auid,
    },
    data: {
      title,
      startDate,
      endDate,
      email,
      subject,
    },
  });

  ctx.body = { status: 'success' };
};

export default handleUpdateActivity;
