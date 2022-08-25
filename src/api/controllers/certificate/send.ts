import { drawName } from "@controllers/admin/certificate/generator";
import PDFDocument from "pdfkit";
import { Middleware } from "@koa/router";
import { SendCertificatePayload } from "types";
import { prisma } from "@models";
import { mailer } from "@utils";

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

  await mailer.sendMail({
    from: "國立臺灣大學雙語教育中心 <ntucbe@ntu.edu.tw>",
    to: user[0].email,
    subject: "2022 NTU EMI Workshop - Certificate of Attendance",
    html: `敬愛的老師，您好：<br /><br />

    感謝您8月26日參與臺大雙語教育中心主辦的的全英語授課工作坊。<br />
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
    </div>`,

    attachments: [
      {
        filename: `${userName}-${certName}.pdf`,
        content: data,
      },
    ],
  });

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
