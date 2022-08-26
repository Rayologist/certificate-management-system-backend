import { Middleware } from "@koa/router";
import { prisma } from "@models";

const handleGetCertificate: Middleware = async (ctx) => {
  const { activity, certificate: certUrl } = ctx.request.query as {
    activity: string;
    certificate: string;
  };

  if (!activity || !certUrl) {
    ctx.status = 400;
    ctx.body = { status: "failed" };
    return;
  }

  const data = await prisma.activity.findMany({
    select: {
      title: true,
      auid: true,
      certificate: {
        select: { displayName: true, id: true },
        where: { url: certUrl },
      },
    },
    where: {
      url: activity,
    },
  });

  if (!data.length || !data[0].certificate.length) {
    ctx.status = 400;
    ctx.body = { status: "failed" };
    return;
  }

  const { title, auid, certificate } = data[0];

  const flattened = {
    activityName: title,
    certificateName: certificate[0].displayName,
    certificateId: certificate[0].id,
    activityUid: auid,
  };

  ctx.body = { status: "success", data: flattened };
};

export default handleGetCertificate;
