import Router from "@koa/router";
import { default as activityRouter } from "./activity";
import { default as certificateRouter } from "./certificate";
import { default as staticRouter } from "./static";
import { default as participantRouter } from "./participant";
import handleCreateSession from "@controllers/admin/session/create";
import validateCreateSession from "@validations/admin/session/create";
import handleDeleteSession from "@controllers/admin/session/delete";
import isAdmin from "@middlewares/isAdmin";
import handleGetSession from "@controllers/admin/session/read";

const router = new Router({ prefix: "/internals" });

router.get("/session", handleGetSession);
router.post("/session", validateCreateSession, handleCreateSession);

router.use(isAdmin());

router.delete("/session", handleDeleteSession);

const routers = [
  activityRouter,
  certificateRouter,
  staticRouter,
  participantRouter,
];

for (const _router of routers) {
  router.use(_router.routes());
  router.use(_router.allowedMethods());
}

export default router;
