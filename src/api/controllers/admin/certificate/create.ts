import { Middleware } from "@koa/router";
import generateCertificate from "./generator";
import { CreateCertificatePayload as Payload } from "types";
import { prisma } from "@models";
const handleCreateCertificate: Middleware = async (ctx) => {
  const { displayName, title, activityUid, totalHour, dateString } = ctx.request
    .body as Payload;

  const { url, filename } = await generateCertificate(
    title,
    totalHour,
    dateString
  );

  const data = await prisma.certificate.create({
    data: {
      activityUid,
      displayName,
      title,
      filename,
      url,
      totalHour,
      dateString,
    },
  });

  ctx.status = 201;
  ctx.body = { status: "success" };
};

export default handleCreateCertificate;
