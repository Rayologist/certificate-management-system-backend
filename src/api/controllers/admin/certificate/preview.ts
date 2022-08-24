import { Middleware } from "koa";
import { drawCertificate } from "./generator";
import { CreateCertificatePayload } from "types";
import { calculateStartPixel } from "./generator";
import { Y } from "./generator/constant";

type Payload = Omit<CreateCertificatePayload, "displayName" | "activityUid"> & {
  dummyName?: string;
};

const handleCertificatePreview: Middleware = async (ctx) => {
  const { title, totalHour, dateString, dummyName } = ctx.request
    .body as Payload;
  const { image, canvas, context } = await drawCertificate(
    title,
    totalHour,
    dateString
  );
  if (dummyName) {
    context.font = '100px "Songti"';

    context.fillText(
      dummyName,
      calculateStartPixel(
        image.naturalWidth,
        context.measureText(dummyName).width
      ),
      Y.name
    );
  }

  ctx.body = canvas.createPNGStream();
};

export default handleCertificatePreview;
