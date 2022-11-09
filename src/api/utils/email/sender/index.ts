import { Email } from '@config';
import Mail from 'nodemailer/lib/mailer';
import mailer from '..';

async function sendCertificate({
  to,
  subject,
  html,
  attachments,
}: {
  to: string;
  attachments: Mail.Attachment[];
  subject: string;
  html: string;
}) {
  return mailer.sendMail({
    from: Email.from,
    to,
    subject,
    html,
    attachments,
  });
}

export default sendCertificate;
