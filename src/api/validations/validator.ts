import { Schema, ValidationError } from 'yup';
import { Middleware } from '@koa/router';

const validate =
  <T>(schema: Schema<T>, returnMessage?: (errors: ValidationError) => object): Middleware =>
  (ctx, next) => {
    try {
      schema.validateSync(ctx.request.body);
      return next();
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
