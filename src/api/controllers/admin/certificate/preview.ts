import { Middleware } from 'koa';
import { CreateCertificatePayload } from 'types';
import { cleanTitle } from '@utils/index';
import { drawCertificate, calculateStartPixel } from './generator';
import Y from './generator/constant';

type Payload = Omit<CreateCertificatePayload, 'displayName' | 'activityUid'> & {
  dummyName?: string;
};

const handleCertificatePreview: Middleware = async (ctx) => {
  const { title, totalHour, dateString, dummyName } = ctx.request.body as Payload;

  const { image, canvas, context } = await drawCertificate(
    cleanTitle(title),
    totalHour,
    dateString,
  );

  if (dummyName) {
    context.font = '100px "Songti"';

    context.fillText(
      dummyName,
      calculateStartPixel(image.naturalWidth, context.measureText(dummyName).width),
      Y.name,
    );
  }

  ctx.body = canvas.createPNGStream();
};

export default handleCertificatePreview;
