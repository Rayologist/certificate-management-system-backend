import { Middleware } from "@koa/router";
import { prisma } from "@models";
import { UpdateCertificatePayload as Payload, Text } from "types";
import { drawCertificate } from "./generator";
import { CERTIFICATE_ROOT } from "@config";
import path from "path";
import fs from "fs";
import { pipeline } from "stream/promises";

const handleUpateCertificate: Middleware = async (ctx) => {
  const { id, title, totalHour, dateString } = ctx.request.body as Payload;

  const cleanedTitle = cleanTitle(title);

  const data = await prisma.certificate.update({
    where: { id },
    data: {
      title: cleanedTitle,
      totalHour,
      dateString,
    },
  });

  {
    const { filename, title: _title, totalHour, dateString } = data;
    const title = _title as Text[];
    const { canvas } = await drawCertificate(title, totalHour, dateString);
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

  ctx.body = { status: "success" };
};

export default handleUpateCertificate;
