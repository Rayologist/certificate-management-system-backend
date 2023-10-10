import { Middleware } from '@koa/router';
import { CreateCertificatePayload as Payload } from 'types';
import { prisma } from '@models';
import { cleanContent } from '@utils/index';
import { TEMPLATE_ID } from '@config';
import generateCertificate from './generator';

const handleCreateCertificate: Middleware = async (ctx) => {
  const { displayName, content, activityUid } = ctx.request.body as Payload;

  // TODO: frontend should provide templateId
  const templateId = TEMPLATE_ID;
  const template = await prisma.template.findUnique({
    where: { id: templateId },
  });

  if (!template) {
    throw new Error('Template not found');
  }

  const cleanedContent = cleanContent(content);

  const { url, filename } = await generateCertificate({
    texts: cleanedContent,
    config: {
      templateFilename: template.filename,
      namePositionY: template.namePositionY,
      titleLowerLimitY: template.titleLowerLimitY,
      titleUpperLimitY: template.titleUpperLimitY,
    },
  });

  await prisma.certificate.create({
    data: {
      activityUid,
      templateId,
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
