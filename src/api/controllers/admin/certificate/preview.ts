import { Middleware } from 'koa';
import { CreateCertificatePayload } from 'types';
import { cleanContent } from '@utils/index';
import { prisma } from '@models';
import { drawCertificate, drawUsername } from './generator';

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

  const {
    image,
    canvas,
    ctx: context,
  } = await drawCertificate({
    texts: cleanContent(content),
    config: {
      templateFilename: template.filename,
      namePositionY: template.namePositionY,
      titleLowerLimitY: template.titleLowerLimitY,
      titleUpperLimitY: template.titleUpperLimitY,
    },
  });

  if (dummyName) {
    drawUsername({
      username: dummyName,
      config: {
        namePositionY: template.namePositionY,
      },
      certGraph: { canvas, image, ctx: context },
    });
  }

  ctx.body = canvas.createPNGStream();
};

export default handleCertificatePreview;
