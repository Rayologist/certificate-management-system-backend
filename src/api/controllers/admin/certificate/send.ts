import { drawName } from "@controllers/admin/certificate/generator";
import PDFDocument from "pdfkit";
import { Middleware } from "@koa/router";
import { AdminSendCertificatePayload } from "types";
import { prisma } from "@models";
import sendCertificate from "@utils/email/sender";

const handleSendCertificate: Middleware = async (ctx) => {
  const { participantId, certificateId } = ctx.request
    .body as AdminSendCertificatePayload;

  const [certificate, user] = await prisma.$transaction([
    prisma.certificate.findUnique({
      where: { id: certificateId },
      select: {
        filename: true,
        available: true,
        displayName: true,
      },
    }),
    prisma.participant.findUnique({
      where: {
        id: participantId,
      },
      include: {
        participantCertificate: {
          select: {
            cid: true,
          },
        },
      },
    }),
  ]);

  if (certificate == null || !user) {
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

  const { canvas, image } = await drawName(certificate.filename, user.name);

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

  const userName = user.name.replace(/\ /g, "_");
  const certName = certificate.displayName.replace(/\ /g, "_");
  await sendCertificate(user.email, [
    {
      filename: `${userName}-${certName}.pdf`,
      content: data,
    },
  ]);

  const cids = user.participantCertificate.map((value) => value.cid);

  if (!cids.includes(certificateId)) {
    await prisma.participantCertificate.create({
      data: {
        cid: certificateId,
        pid: user.id,
      },
    });
  }

  ctx.body = { status: "success" };
};

export default handleSendCertificate;
