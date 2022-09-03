import Router from '@koa/router';
import { PREFIX } from '@config';
import privateRouter from './private';
import certificateRouter from './cert';

const entry = new Router();

entry.prefix(PREFIX);

const routers = [privateRouter, certificateRouter];

routers.forEach((router) => {
  entry.use(router.routes());
  entry.use(router.allowedMethods());
});

export default entry;
