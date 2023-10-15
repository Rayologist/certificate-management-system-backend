import { Middleware } from 'koa';
import { CreateCertificatePayload } from 'types';
import { cleanContent } from '@utils/index';
import { prisma } from '@models';
import { TEMPLATE_PATH } from '@config';
import { createCertGraph, renderCertificate, renderName } from './generator';

type Payload = Omit<CreateCertificatePayload, 'displayName' | 'activityUid'> & {
  dummyName?: string;
};

const handleCertificatePreview: Middleware = async (ctx) => {
  const { content, dummyName, templateId } = ctx.request.body as Payload;

  const template = await prisma.template.findUnique({
    where: { id: templateId },
  });

  if (!template) {
    throw new Error('Template not found');
  }

  const certGraph = await createCertGraph(TEMPLATE_PATH, template.filename);
  renderCertificate({
    texts: cleanContent(content),
    config: {
      namePositionY: template.namePositionY,
      titleLowerLimitY: template.titleLowerLimitY,
      titleUpperLimitY: template.titleUpperLimitY,
    },
    certGraph,
  });

  if (dummyName) {
    renderName({
      username: dummyName,
      config: {
        namePositionY: template.namePositionY,
      },
      certGraph,
    });
  }

  ctx.body = certGraph.canvas.createPNGStream();
};

export default handleCertificatePreview;
