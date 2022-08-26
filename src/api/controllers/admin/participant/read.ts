import { Middleware } from "@koa/router";
import { prisma } from "@models";
import { isUUID } from "@utils";

const handleGetParticipantByActivity: Middleware = async (ctx) => {
  try {
    const { auid } = ctx.params as { auid: string };

    if (!isUUID(auid)) {
      ctx.body = { status: "failed" };
      return;
    }

    const data = await prisma.activity.findUnique({
      where: { auid },
      include: {
        participant: {
          include: {
            participantCertificate: {
              select: {
                certificate: {
                  select: {
                    displayName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    ctx.body = { status: "success", data };
  } catch (error) {
    console.error(error);
    ctx.status = 400;
    ctx.body = { status: "failed" };
  }
};

const handleGetParticipantStats: Middleware = async (ctx) => {
  const data = await prisma.activity.findMany({
    select: {
      auid: true,
      title: true,
      _count: {
        select: {
          participant: true,
        },
      },
    },
  });
  ctx.body = { status: "success", data };
};

export { handleGetParticipantByActivity, handleGetParticipantStats };
