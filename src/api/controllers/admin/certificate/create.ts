import { Middleware } from '@koa/router';
import { CreateCertificatePayload as Payload } from 'types';
import { prisma } from '@models';
import { cleanTitle } from '@utils/index';
import generateCertificate from './generator';

const handleCreateCertificate: Middleware = async (ctx) => {
  const { displayName, title, activityUid, totalHour, dateString } = ctx.request.body as Payload;

  const cleanedTitle = cleanTitle(title);

  const { url, filename } = await generateCertificate(cleanedTitle, totalHour, dateString);

  await prisma.certificate.create({
    data: {
      activityUid,
      displayName,
      title: cleanedTitle,
      filename,
      url,
      totalHour,
      dateString,
    },
  });

  ctx.status = 201;
  ctx.body = { status: 'success' };
};

export default handleCreateCertificate;
