import handleGetCertificate from '@controllers/certificate/read';
import handleSendCertificate from '@controllers/certificate/send';
import Router from '@koa/router';
import hasCert from '@middlewares/cert';
import validateSendCertificate from '@validations/certificate/send';

const router = new Router({ prefix: '/cert' });

router.get('/', handleGetCertificate);
router.post('/', validateSendCertificate, hasCert(), handleSendCertificate);

export default router;
