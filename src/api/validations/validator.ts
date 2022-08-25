import { Next } from "koa";
import { SchemaOf, ValidationError } from "yup";
import { RouterContext } from "@koa/router";

function validate<T>(
  schema: SchemaOf<T>,
  returnMessage?: (errors: ValidationError) => object
) {
  return async (ctx: RouterContext, next: Next) => {
    try {
      await schema.validate(ctx.request.body);
      return next();
    } catch (err) {
      const errors = err as ValidationError;
      console.log(errors);
      ctx.status = 422;
      if (typeof returnMessage === "function") {
        ctx.body = { status: "failed", data: returnMessage(errors) };
        return;
      }
      ctx.body = { status: "failed", msg: "invalid request body" };
    }
  };
}

export default validate;
