import cors from "@koa/cors";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import koaConditionalGet from "koa-conditional-get";
import { corsConfig } from "./config";
import etag from "@middlewares/etag";
import router from "./routes";
import session from "@middlewares/session";

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error(error);
    ctx.body = { status: "failed" };
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