import Router from "@koa/router";
import { default as privateRouter } from "./private";
import { default as certificateRouter } from "./cert";

const router = new Router();

const routers = [privateRouter, certificateRouter];

for (const _router of routers) {
  router.use(_router.routes());
  router.use(_router.allowedMethods());
}

export default router;
