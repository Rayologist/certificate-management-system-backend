import Mail from 'nodemailer/lib/mailer';
import mailer from '..';

const content = `敬愛的老師，您好：<br /><br />

感謝您參與臺大雙語教育中心主辦的全英語授課工作坊。<br />
附件為時數認證書，請查收。<br /><br />

歡迎您持續關注本中心的<a rel="noreferrer noopener" href="https://cbe.ntu.edu.tw/">官網</a>及社群媒體，以利未來接收更多與EMI相關的活動消息。<br />
我們期待再次與您相見！<br /><br />

敬祝 教安 <br />
國立臺灣大學雙語教育中心 敬上<br /><br /><br />

Dear professor/teacher/faculty member,<br /><br />

Thank you for attending the EMI Workshop "Bridging the Gap: Interdisciplinary EMI Strategies" on August 26th, 2022
held by Center for Bilingual Education.<br />
Please find attached the Certification of Attendance. <br /><br />

If your interested in EMI, please stay tuned to our <a rel="noreferrer noopener"
    href="https://cbe.ntu.edu.tw/">website</a> and social media platforms for more information on our
upcoming events.<br />

We look forward to seeing you again soon!<br /><br />
<div style="color: #4472C4; font-size: 11pt;">
    ================================================<br />
    National Taiwan University<br />
    Center for Bilingual Education<br />
    Phone: +886-(0)2-3366-7970<br />
    Email: <a href="mailto:ntucbe@ntu.edu.tw" rel="noreferrer" style="color: #00ACFF;">ntucbe@ntu.edu.tw</a><br />
    Address: No.1, Sec.4, Roosevelt Rd., Taipei, 10617, Taiwan<br />
    Website: https://cbe.ntu.edu.tw/<br />
</div>`;

async function sendCertificate(email: string, attachments: Mail.Attachment[]) {
  return mailer.sendMail({
    from: '國立臺灣大學雙語教育中心 <ntucbe@ntu.edu.tw>',
    to: email,
    subject: '2022 NTU EMI Workshop - Certificate of Attendance',
    html: content,
    attachments,
  });
}

export default sendCertificate;
