import { Middleware } from "@koa/router";
import { prisma } from "@models";

const handleDeleteCertificate: Middleware = async (ctx) => {
  const { id } = ctx.request.body;
  await prisma.certificate.delete({ where: { id } });
  ctx.body = { status: "success" };
};

export default handleDeleteCertificate;
