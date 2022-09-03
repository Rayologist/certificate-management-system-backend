import { SchemaOf, ValidationError } from 'yup';
import { Middleware } from '@koa/router';

const validate =
  <T>(schema: SchemaOf<T>, returnMessage?: (errors: ValidationError) => object): Middleware =>
  async (ctx, next) => {
    try {
      await schema.validate(ctx.request.body);
      return await next();
    } catch (err) {
      const errors = err as ValidationError;

      console.log(errors); // eslint-disable-line no-console
      ctx.status = 422;
      if (typeof returnMessage === 'function') {
        ctx.body = { status: 'failed', data: returnMessage(errors) };
        return null;
      }
      ctx.body = { status: 'failed', msg: 'invalid request body' };
    }
    return null;
  };

export default validate;
