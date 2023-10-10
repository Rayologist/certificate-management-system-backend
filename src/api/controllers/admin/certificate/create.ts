import { Middleware } from '@koa/router';
import { CreateCertificatePayload as Payload } from 'types';
import { prisma } from '@models';
import { cleanContent } from '@utils/index';
import generateCertificate from './generator';

const handleCreateCertificate: Middleware = async (ctx) => {
  const { displayName, content, activityUid } = ctx.request.body as Payload;

  const cleanedContent = cleanContent(content);

  const { url, filename } = await generateCertificate(cleanedContent);

  await prisma.certificate.create({
    data: {
      activityUid,
      displayName,
      content: cleanedContent,
      filename,
      url,
    },
  });

  ctx.status = 201;
  ctx.body = { status: 'success' };
};

export default handleCreateCertificate;
