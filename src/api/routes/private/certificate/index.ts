import Router from '@koa/router';
import handleGetCertificate from '@controllers/admin/certificate/read';
import handleUpdateCertificate from '@controllers/admin/certificate/update';
import validateUpdateCertificate from '@validations/admin/certificate/update';
import handleCreateCertificate from '@controllers/admin/certificate/create';
import validateCreateCertificate from '@validations/admin/certificate/create';
import handleCertificatePreview from '@controllers/admin/certificate/preview';
import validateDeleteCertificate from '@validations/admin/certificate/delete';
import handleDeleteCertificate from '@controllers/admin/certificate/delete';
import handleSendCertificate, { publishCertificates } from '@controllers/admin/certificate/send';

const router = new Router({ prefix: '/certificate' });

router.get('/', handleGetCertificate);
router.post('/send', handleSendCertificate);
router.post('/batch-send', async (ctx) => {
  const { participantIds, certificateId } = ctx.request.body as any;

  await publishCertificates({
    certificateId,
    participantIds,
  });

  ctx.status = 200;
  return true;
});
router.post('/', validateCreateCertificate, handleCreateCertificate);
router.put('/', validateUpdateCertificate, handleUpdateCertificate);
router.delete('/', validateDeleteCertificate, handleDeleteCertificate);
router.post('/preview', handleCertificatePreview);

export default router;
