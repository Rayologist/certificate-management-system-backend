import { Next } from "koa";
import { SchemaOf } from "Yup";
import { RouterContext } from "@koa/router";
import debug from "debug";

const log = debug("validate");

function validate<T>(schema: SchemaOf<T>) {
  return async (ctx: RouterContext, next: Next) => {
    try {
      await schema.validate(ctx.request.body);

      return next();
    } catch (error) {
      log(error);
      console.log(error);
      ctx.status = 422;
      ctx.body = { status: "failed", msg: "invalid request body" };
    }
  };
}

export default validate;
