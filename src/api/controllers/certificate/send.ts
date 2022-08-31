import { drawName } from "@controllers/admin/certificate/generator";
import PDFDocument from "pdfkit";
import { Middleware } from "@koa/router";
import { SendCertificatePayload } from "types";
import { prisma } from "@models";
import sendCertificate from "@utils/email/sender";

const handleSendCertificate: Middleware = async (ctx) => {
  const { activityUid, certificateId, name, email } = ctx.request
    .body as SendCertificatePayload;

  const [certificate, user] = await prisma.$transaction([
    prisma.certificate.findUnique({
      where: { id: certificateId },
      select: { filename: true, available: true, displayName: true },
    }),
    prisma.participant.findMany({
      select: {
        id: true,
        email: true,
        participantCertificate: { where: { cid: certificateId } },
      },
      where: {
        activityUid,
        email,
        name,
      },
    }),
  ]);

  if (certificate == null || !user.length) {
    ctx.status = 400;
    ctx.body = { status: "failed" };
    return;
  }

  if (!certificate.available) {
    ctx.status = 503;
    ctx.set("Retry-After", "5");
    ctx.body = { status: "failed", msg: "unavaliable" };
    return;
  }

  if (user[0].participantCertificate.length) {
    ctx.certs.push(certificateId);
    const certs = JSON.stringify(ctx.certs);
    ctx.cookies.set(activityUid, certs, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });
    ctx.body = { status: "success", msg: "already sent" };

    return;
  }

  const { canvas, image } = await drawName(certificate.filename, name);

  const data = await new Promise<Buffer>((resolve) => {
    const doc = new PDFDocument({
      size: [image.naturalWidth, image.naturalHeight],
    });

    doc.image(canvas.toBuffer(), 0, 0);
    doc.end();

    let buffers: Buffer[] = [];

    doc.on("data", (stream) => buffers.push(stream));
    doc.on("end", () => {
      const buffer = Buffer.concat(buffers);
      resolve(buffer);
    });
  });

  const userName = name.replace(/\ /g, "_");
  const certName = certificate.displayName.replace(/\ /g, "_");
  await sendCertificate(user[0].email, [
    {
      filename: `${userName}-${certName}.pdf`,
      content: data,
    },
  ]);

  await prisma.participantCertificate.create({
    data: {
      cid: certificateId,
      pid: user[0].id,
    },
  });

  ctx.certs.push(certificateId);
  const certs = JSON.stringify(ctx.certs);
  ctx.cookies.set(activityUid, certs, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  });

  ctx.body = { status: "success" };
};

export default handleSendCertificate;
