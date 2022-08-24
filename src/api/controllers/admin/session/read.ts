import { Middleware } from "@koa/router";

const handleGetSession: Middleware = async (ctx) => {
  if (ctx.session.role) {
    ctx.body = {
      status: "success",
      data: {
        role: ctx.session.role,
      },
    };

    return;
  }
  ctx.body = { status: "success" };
};

export default handleGetSession;
