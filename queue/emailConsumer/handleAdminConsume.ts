import handleSendCertificate from '@controllers/admin/certificate/send';
import { MQAdminSendCertificatePayload } from 'types';

export async function handleAdminConsume(payload: MQAdminSendCertificatePayload) {
  const { participantId, certificateId } = payload;

  await handleSendCertificate(
    {
      request: {
        body: {
          participantId,
          certificateId,
          altName: '',
        },
      },
    } as any,
    {} as any,
  );
}
