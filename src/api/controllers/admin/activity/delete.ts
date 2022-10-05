import { Middleware } from '@koa/router';
import { prisma } from '@models';

type Payload = {
  auid: string;
};

const handleDeleteActivity: Middleware = async (ctx) => {
  const { auid } = ctx.request.body as Payload;
  const certIdsRaw = await prisma.certificate.findMany({
    where: { activityUid: auid },
    select: { id: true },
  });
  const certIds = certIdsRaw.map((cert) => cert.id);

  await prisma.$transaction([
    prisma.participantCertificate.deleteMany({
      where: { cid: { in: certIds } },
    }),
    prisma.participant.deleteMany({ where: { activityUid: auid } }),
    prisma.certificate.deleteMany({ where: { id: { in: certIds } } }),
    prisma.activity.delete({
      where: {
        auid,
      },
    }),
  ]);

  ctx.body = { status: 'success' };
};

export default handleDeleteActivity;
