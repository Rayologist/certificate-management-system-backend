import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaConditionalGet from 'koa-conditional-get';
import etag from '@middlewares/etag';
import session from '@middlewares/session';
import morgan from 'koa-morgan';
import customDevFormat from '@utils/logger';
import router from './routes';
import { corsConfig } from './config';

morgan.format('custom-dev', customDevFormat);

const app = new Koa();

app.proxy = true;
app.use(morgan('custom-dev'));
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    // eslint-disable-nex-line no-console
    console.error(error);
    ctx.body = { status: 'failed' };
  }
});
app.use(koaConditionalGet());
app.use(etag());

app.use(cors(corsConfig));
app.use(bodyParser());
app.use(session());

app.use(router.routes());
app.use(router.allowedMethods());

export default app;
