import { Middleware } from '@koa/router';
import { prisma } from '@models';
import { UpdateCertificatePayload as Payload, Text } from 'types';
import { CERTIFICATE_ROOT } from '@config';
import path from 'path';
import fs from 'fs';
import { pipeline } from 'stream/promises';
import { cleanContent } from '@utils/index';
import { drawCertificate } from './generator';

const handleUpateCertificate: Middleware = async (ctx) => {
  const { id, displayName, content } = ctx.request.body as Payload;

  const cleanedContent = cleanContent(content);

  const data = await prisma.certificate.update({
    where: { id },
    data: {
      displayName,
      content: cleanedContent,
    },
  });

  /* eslint-disable @typescript-eslint/no-shadow */
  {
    const { filename, content: certTitle } = data;
    const title = certTitle as Text[];
    const { canvas } = await drawCertificate(title);
    const filePath = path.resolve(CERTIFICATE_ROOT, filename);

    // continuous awaits slow down server request
    // but to prevent race condition this is necessary.
    await prisma.certificate.update({
      where: { id },
      data: { available: false },
    });
    await pipeline(canvas.createPNGStream(), fs.createWriteStream(filePath));
    await prisma.certificate.update({
      where: { id },
      data: { available: true },
    });
  }

  ctx.body = { status: 'success' };
};

export default handleUpateCertificate;
