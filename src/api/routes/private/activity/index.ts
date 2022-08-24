import Router from "@koa/router";
import handleGetActivity from "@controllers/admin/activity/read";
import handleCreateActivity from "@controllers/admin/activity/create";
import validateCreateActivity from "@validations/admin/activity/create";
import handleUpdateActivity from "@controllers/admin/activity/update";
import validateUpdateActivity from "@validations/admin/activity/update";
import handleDeleteActivity from "@controllers/admin/activity/delete";
import validateDeleteActivity from "@validations/admin/activity/delete";

const router = new Router({ prefix: "/activity" });

router.get("/", handleGetActivity);
router.post("/", validateCreateActivity, handleCreateActivity);
router.put("/", validateUpdateActivity, handleUpdateActivity);
router.delete("/", validateDeleteActivity, handleDeleteActivity);

export default router;
