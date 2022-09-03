import { RouterContext } from '@koa/router';

const parse = (qs: string) => {
  const parseQS = (str: string) => {
    const regex = /^([w|h])(\d+)$/;
    return str.match(regex);
  };

  const query = qs.split('-');
  const parsed: { [key: string]: string } = {};

  for (let i = 0; i < query.length; i += 1) {
    const result = parseQS(query[i]);
    if (result == null) {
      return false;
    }
    const [, widthOrHeight, number] = result;
    parsed[widthOrHeight] = number;
  }

  return parsed;
};

const parseImageSize = async (ctx: RouterContext) => {
  const { url } = ctx.params as { url: string };
  const splited = url.split('=');
  if (splited.length === 2) {
    const qs = splited[1];
    const parsed = parse(qs);

    if (!parsed) {
      ctx.status = 400;
      return;
    }

    ctx.imageSize = { width: Number(parsed.w), height: Number(parsed.h) };
  }
};

export default parseImageSize;
