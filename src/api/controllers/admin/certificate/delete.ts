import { Middleware } from '@koa/router';
import { prisma } from '@models';

type RequestBody = { request: { body: { id: number } } };

const handleDeleteCertificate: Middleware<{}, RequestBody> = async (ctx) => {
  const { id } = ctx.request.body;
  await prisma.certificate.delete({ where: { id } });
  ctx.body = { status: 'success' };
};

export default handleDeleteCertificate;
