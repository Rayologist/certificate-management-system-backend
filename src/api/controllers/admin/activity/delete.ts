import { Middleware } from "@koa/router";
import { prisma } from "@models";

type Payload = {
  auid: string;
};

const handleDeleteActivity: Middleware = async (ctx) => {
  const { auid } = ctx.request.body as Payload;

  await prisma.activity.delete({
    where: {
      auid,
    },
  });

  ctx.body = { status: "success" };
};

export default handleDeleteActivity;
