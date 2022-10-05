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
    from: '國立臺灣大學雙語教育中心 <ntucbe@ntu.edu.tw>',
    to,
    subject,
    html,
    attachments,
  });
}

export default sendCertificate;
