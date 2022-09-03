import handleGetStaticCertificate from '@controllers/admin/static/read';
import Router from '@koa/router';

const router = new Router({ prefix: '/f' });

router.get('/:url', handleGetStaticCertificate);

export default router;
