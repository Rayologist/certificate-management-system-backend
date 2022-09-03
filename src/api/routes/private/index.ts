import Router from '@koa/router';
import handleCreateSession from '@controllers/admin/session/create';
import validateCreateSession from '@validations/admin/session/create';
import handleDeleteSession from '@controllers/admin/session/delete';
import isAdmin from '@middlewares/isAdmin';
import handleGetSession from '@controllers/admin/session/read';
import participantRouter from './participant';
import staticRouter from './static';
import certificateRouter from './certificate';
import activityRouter from './activity';

const internals = new Router({ prefix: '/internals' });

internals.get('/session', handleGetSession);
internals.post('/session', validateCreateSession, handleCreateSession);

internals.use(isAdmin());

internals.delete('/session', handleDeleteSession);

const routers = [activityRouter, certificateRouter, staticRouter, participantRouter];

routers.forEach((router) => {
  internals.use(router.routes());
  internals.use(router.allowedMethods());
});

export default internals;
