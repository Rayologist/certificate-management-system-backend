import { Middleware } from '@koa/router';
import { CreateCertificatePayload as Payload } from 'types';
import { prisma } from '@models';
import { cleanContent } from '@utils/index';
import { TEMPLATE_PATH } from '@config';
import savaCertificate, { createCertGraph, renderCertificate } from './generator';

const handleCreateCertificate: Middleware = async (ctx) => {
  const { displayName, content, activityUid, templateId } = ctx.request.body as Payload;

  const template = await prisma.template.findUnique({
    where: { id: templateId },
  });

  if (!template) {
    throw new Error('Template not found');
  }

  const cleanedContent = cleanContent(content);

  const certGraph = await createCertGraph(TEMPLATE_PATH, template.filename);

  renderCertificate({
    texts: cleanedContent,
    config: {
      namePositionY: template.namePositionY,
      titleLowerLimitY: template.titleLowerLimitY,
      titleUpperLimitY: template.titleUpperLimitY,
    },
    certGraph,
  });

  const { url, filename } = await savaCertificate({
    texts: cleanedContent,
    certGraph,
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
