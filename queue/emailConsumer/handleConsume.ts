import { ConsumeMessage } from 'amqplib';
import PDFDocument from 'pdfkit';
import { drawName } from '@controllers/admin/certificate/generator';
import sendCertificate from '@utils/email/sender';
import { MQSendCertficatePayload } from 'types';
import format from 'date-fns/format';

const handleConsume = async (msg: ConsumeMessage | null) => {
  const now = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  try {
    const content = msg?.content.toString() || '{}';

    if (content === '{}') return null;

    const { filename, displayName, participantName, email }: MQSendCertficatePayload =
      JSON.parse(content);

    // eslint-disable-next-line no-console
    console.log(now, `certificate="${displayName}" email="${email}"`);

    if (!filename || !displayName || !participantName || !email) return null;

    const { canvas, image } = await drawName(filename, participantName);

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
    const certName = displayName.replace(/\s/g, '_');

    await sendCertificate(email, [
      {
        filename: `${userName}-${certName}.pdf`,
        content: data,
      },
    ]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(now, error);
  }
  return null;
};

export default handleConsume;
