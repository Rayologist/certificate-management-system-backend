import { Middleware } from '@koa/router';
import { CERTIFICATE_ROOT } from '@config';
import send from 'koa-send';
import path from 'path';
import { prisma } from '@models';
import resizeImage from './resizer';

const handleGetStaticCertificate: Middleware = async (ctx) => {
  const { url: params } = ctx.params;

  const [url] = params.split('=');

  if (url === 'template') {
    ctx.set('Content-Disposition', `filename*=utf-8''${encodeURIComponent(template.filename)}`);

    await send(ctx, filename, {
      root: path.resolve(CERTIFICATE_ROOT, '..'),
      setHeaders: (res) => {
        res.setHeader('Cache-Control', 'private, max-age=0');
      },
    });

    return null;
  }

  const cert = await prisma.certificate.findMany({
    select: {
      filename: true,
      displayName: true,
      available: true,
    },
    where: {
      url,
    },
  });

  if (cert.length) {
    if (!cert[0].available) {
      ctx.status = 503;
      ctx.set('Retry-After', '5');
      return null;
    }

    const { filename, displayName } = cert[0];

    ctx.set('Content-Disposition', `filename*=utf-8''${encodeURIComponent(displayName)}`);

    await send(ctx, filename, {
      root: CERTIFICATE_ROOT,
      setHeaders: (res) => {
        res.setHeader('Cache-Control', 'private, max-age=0');
      },
    });

    await resizeImage(ctx);

    return null;
  }

  ctx.status = 404;

  return null;
};

export default handleGetStaticCertificate;
