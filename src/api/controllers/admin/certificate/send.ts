import { createCertGraph, drawUsername } from '@controllers/admin/certificate/generator';
import PDFDocument from 'pdfkit';
import { Middleware } from '@koa/router';
import { AdminSendCertificatePayload } from 'types';
import { prisma } from '@models';
import sendCertificate from '@utils/email/sender';
import sanitize from 'sanitize-filename';
import { CERTIFICATE_ROOT } from '@config';

const handleSendCertificate: Middleware = async (ctx) => {
  const { participantId, certificateId, altName } = ctx.request.body as AdminSendCertificatePayload;
  const alternativeName = altName.trim();

  const [certificate, user] = await prisma.$transaction([
    prisma.certificate.findUnique({
      where: { id: certificateId },
      select: {
        template: { select: { namePositionY: true } },
        filename: true,
        available: true,
        displayName: true,
        activity: { select: { email: true, subject: true } },
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
    ctx.body = { status: 'failed' };
    return;
  }

  if (!certificate.available) {
    ctx.status = 503;
    ctx.set('Retry-After', '5');
    ctx.body = { status: 'failed', msg: 'unavaliable' };
    return;
  }

  const nameOnCert = alternativeName === '' ? user.name : alternativeName;

  const certGraph = await createCertGraph(CERTIFICATE_ROOT, certificate.filename);
  const { canvas, image } = drawUsername({
    username: nameOnCert,
    config: {
      namePositionY: certificate.template.namePositionY,
    },
    certGraph,
  });

  const data = await new Promise<Buffer>((resolve) => {
    const doc = new PDFDocument({
      size: [image.naturalWidth, image.naturalHeight],
    });

    doc.image(canvas.toBuffer(), 0, 0);
    doc.end();

    const buffers: Buffer[] = [];

    doc.on('data', (stream) => buffers.push(stream));
    doc.on('end', () => {
      const buffer = Buffer.concat(buffers);
      resolve(buffer);
    });
  });

  const userName = nameOnCert.replace(/\s/g, '_');
  const certName = certificate.displayName.replace(/\s/g, '_');
  await sendCertificate({
    to: user.email,
    subject: certificate.activity.subject,
    html: certificate.activity.email,
    attachments: [
      {
        filename: sanitize(`${userName}-${certName}.pdf`),
        content: data,
      },
    ],
  });

  const cids = user.participantCertificate.map((value) => value.cid);

  if (!cids.includes(certificateId)) {
    await prisma.participantCertificate.create({
      data: {
        cid: certificateId,
        pid: user.id,
      },
    });
  }

  ctx.body = { status: 'success' };
};

export default handleSendCertificate;
