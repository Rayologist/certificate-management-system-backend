import { Middleware } from "@koa/router";
import { SendCertificatePayload } from "types";
import { parseCookie } from "@utils";

const hasCert = (): Middleware => async (ctx, next) => {
  const { certificateId, activityUid } = ctx.request
    .body as SendCertificatePayload;

  const cookie = ctx.cookies.get(activityUid);
  ctx.certs = [];

  if (!cookie) {
    await next();
    return;
  }

  const data = parseCookie<number[]>(cookie);

  if (!Array.isArray(data)) {
    await next();
    return;
  }

  if (data.includes(certificateId)) {
    ctx.body = { status: "success", msg: "already sent" };
    return;
  }

  ctx.certs = [...data];

  await next();
};

export default hasCert;
