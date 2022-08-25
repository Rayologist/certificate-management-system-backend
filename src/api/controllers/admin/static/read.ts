import { Middleware } from "@koa/router";
import { CERTIFICATE_ROOT } from "@config";
import send from "koa-send";
import path from "path";
import resizeImage from "./resizer";
import { prisma } from "@models";

const handleGetStaticCertificate: Middleware = async (ctx) => {
  let { url } = ctx.params;

  url = url.split("=")[0];

  if (url === "template") {
    const filename = "template.png";
    ctx.set("Content-Disposition", `filename=${filename}`);

    await send(ctx, filename, {
      root: path.resolve(CERTIFICATE_ROOT, ".."),
      setHeaders: (res, path, stats) => {
        res.setHeader("Cache-Control", "private, max-age=0");
      },
    });

    return;
  }

  const cert = await prisma.certificate.findMany({
    select: {
      filename: true,
      displayName: true,
      available: true,
    },
    where: {
      url,
    },
  });

  if (cert.length) {
    if (!cert[0].available) {
      ctx.status = 503;
      ctx.set("Retry-After", "5");
      return;
    }

    const { filename, displayName } = cert[0];

    ctx.set("Content-Disposition", `filename=${displayName}`);

    await send(ctx, filename, {
      root: CERTIFICATE_ROOT,
      setHeaders: (res, path, stats) => {
        res.setHeader("Cache-Control", "private, max-age=0");
      },
    });

    await resizeImage(ctx);

    return;
  }

  ctx.status = 404;
};

export default handleGetStaticCertificate;
