import { Middleware } from "@koa/router";
import { prisma } from "@models";

const handleGetCertificate: Middleware = async (ctx) => {
  const data = await prisma.activity.findMany({
    include: {
      certificate: true,
    },
  });
  ctx.body = { status: "success", data };
};


export default handleGetCertificate;
