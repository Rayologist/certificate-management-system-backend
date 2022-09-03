import { Middleware } from '@koa/router';
import { prisma } from '@models';
import { CreateParticipantPayload } from 'types';

const handleCreateParticipant: Middleware = async (ctx) => {
  const payload = ctx.request.body as { data: CreateParticipantPayload[] };

  let { data } = payload;

  data = data.map((value) => {
    const email = value.email.trim();
    const name = value.name.trim();
    return { ...value, email, name };
  });

  await prisma.participant.createMany({ data });
  ctx.status = 201;
  ctx.body = { status: 'success' };
};

export default handleCreateParticipant;
