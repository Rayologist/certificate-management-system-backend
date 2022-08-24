import { Middleware } from "@koa/router";
import koaEtag from "koa-etag";

const etag = (): Middleware => async (ctx, next) => {
  const etag = koaEtag();

  await etag(ctx, next);

  // koa-send sets Last-Modified automatically
  // This behavior will disable etag in browsers
  // because browsers prefer Last-Modified over Etag

  ctx.response.remove("Last-Modified");
};

export default etag;
