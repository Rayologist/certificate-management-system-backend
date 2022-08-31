import { Middleware } from "@koa/router";
import generateCertificate from "./generator";
import { CreateCertificatePayload as Payload } from "types";
import { prisma } from "@models";
import { cleanTitle } from "@utils/index";

const handleCreateCertificate: Middleware = async (ctx) => {
  let { displayName, title, activityUid, totalHour, dateString } = ctx.request
    .body as Payload;

  title = cleanTitle(title);

  const { url, filename } = await generateCertificate(
    title,
    totalHour,
    dateString
  );

  await prisma.certificate.create({
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
