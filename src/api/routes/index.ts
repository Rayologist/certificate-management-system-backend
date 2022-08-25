import Router from "@koa/router";
import { default as privateRouter } from "./private";
import { default as certificateRouter } from "./cert";
import { PREFIX } from "@config";

const router = new Router();

router.prefix(PREFIX);

const routers = [privateRouter, certificateRouter];

for (const _router of routers) {
  router.use(_router.routes());
  router.use(_router.allowedMethods());
}

export default router;
