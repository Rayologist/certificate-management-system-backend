import PDFDocument from 'pdfkit';
import { createCertGraph, renderName } from '@controllers/admin/certificate/generator';
import sendCertificate from '@utils/email/sender';
import { MQSendCertificatePayload } from 'types';
import format from 'date-fns/format';
import sanitize from 'sanitize-filename';
import { prisma } from '@models';
import { CERTIFICATE_ROOT } from '@config';

const handleConsume = async (payload: MQSendCertificatePayload) => {
  const now = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  try {
    const { participantName, userEmail, certificateId }: MQSendCertificatePayload = payload;
    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
      select: {
        template: { select: { namePositionY: true } },
        filename: true,
        available: true,
        displayName: true,
        activity: { select: { email: true, subject: true } },
      },
    });

    // eslint-disable-next-line no-console
    console.log(
      now,
      `certificateId="${certificateId}", displayName="${certificate?.displayName}", email="${userEmail}"`,
    );

    if (!participantName || !userEmail || !certificate) return null;

    const certGraph = await createCertGraph(CERTIFICATE_ROOT, certificate.filename);
    const { canvas, image } = renderName({
      username: participantName,
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

    const userName = participantName.replace(/\s/g, '_');
    const certName = certificate.displayName.replace(/\s/g, '_');

    await sendCertificate({
      to: userEmail,
      subject: certificate.activity.subject,
      html: certificate.activity.email,
      attachments: [
        {
          filename: sanitize(`${userName}-${certName}.pdf`),
          content: data,
        },
      ],
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(now, error);
  }
  return null;
};

export default handleConsume;
