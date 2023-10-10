import { Middleware } from 'koa';
import { CreateCertificatePayload } from 'types';
import { cleanContent } from '@utils/index';
import { prisma } from '@models';
import { TEMPLATE_ID } from '@config';
import { drawCertificate, calculateStartPixel } from './generator';

type Payload = Omit<CreateCertificatePayload, 'displayName' | 'activityUid'> & {
  dummyName?: string;
};

const handleCertificatePreview: Middleware = async (ctx) => {
  const { content, dummyName } = ctx.request.body as Payload;

  // TODO: frontend should provide templateId
  const templateId = TEMPLATE_ID;
  const template = await prisma.template.findUnique({
    where: { id: templateId },
  });

  if (!template) {
    throw new Error('Template not found');
  }

  const { image, canvas, context } = await drawCertificate({
    texts: cleanContent(content),
    config: {
      templateFilename: template.filename,
      namePositionY: template.namePositionY,
      titleLowerLimitY: template.titleLowerLimitY,
      titleUpperLimitY: template.titleUpperLimitY,
    },
  });

  if (dummyName) {
    context.font = '100px "Songti"';

    context.fillText(
      dummyName,
      calculateStartPixel(image.naturalWidth, context.measureText(dummyName).width),
      template.namePositionY,
    );
  }

  ctx.body = canvas.createPNGStream();
};

export default handleCertificatePreview;
