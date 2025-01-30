import { Middleware } from '@koa/router';
import { SendCertificatePayload, MQSendCertificatePayload } from 'types';
import { prisma, connectionManager } from '@models';
import format from 'date-fns/format';

async function publishCertificateEmail({
  userEmail,
  participantName,
  certificateId,
}: MQSendCertificatePayload) {
  try {
    const queue = 'email';
    const channel = await connectionManager.getChannel();

    await channel.assertQueue(queue);

    channel.sendToQueue(
      queue,
      Buffer.from(
        JSON.stringify({
          type: 'userSendCertificate',
          userEmail,
          certificateId,
          participantName,
        }),
      ),
    );

    await channel.close();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(format(new Date(), 'yyyy-MM-dd HH:mm:ss'), error);
    return false;
  }
  return null;
}

const handleSendCertificate: Middleware = async (ctx) => {
  const { activityUid, certificateId, altName, name, email } = ctx.request
    .body as SendCertificatePayload;

  const [certificate, user] = await prisma.$transaction([
    prisma.certificate.findUnique({
      where: { id: certificateId },
      select: { id: true },
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
    ctx.body = { status: 'failed', msg: 'unauthorized' };
    return null;
  }

  if (user[0].participantCertificate.length) {
    ctx.certs.push(certificateId);
    const certs = JSON.stringify(ctx.certs);
    ctx.cookies.set(activityUid, certs, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });
    ctx.body = { status: 'success', msg: 'already sent' };

    return null;
  }

  const participantName = altName.trim() === '' ? name : altName;

  const publishResult = await publishCertificateEmail({
    userEmail: user[0].email,
    participantName,
    certificateId,
  });

  if (publishResult === false) {
    ctx.status = 500;
    ctx.body = { status: 'failed', msg: 'mail server error' };
    return null;
  }

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

  ctx.body = { status: 'success' };

  return null;
};

export default handleSendCertificate;
