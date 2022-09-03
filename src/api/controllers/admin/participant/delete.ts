import { Middleware } from '@koa/router';
import { prisma } from '@models';

const handleDeleteParticipant: Middleware = async (ctx) => {
  const { id } = ctx.request.body as { id: number };
  await prisma.participant.delete({ where: { id } });
  ctx.status = 201;
  ctx.body = { status: 'success' };
};

export default handleDeleteParticipant;
