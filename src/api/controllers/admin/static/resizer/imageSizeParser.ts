import { RouterContext } from "@koa/router";

const parse = (qs: string) => {
  const _parse = (str: string) => {
    const regex = /^([w|h])(\d+)$/;
    return str.match(regex);
  };

  const query = qs.split("-");
  const parsed: { [key: string]: string } = {};

  for (let i = 0; i < query.length; ++i) {
    const result = _parse(query[i]);
    if (result == null) {
      return false;
    }
    parsed[result[1]] = result[2];
  }

  return parsed;
};

const parseImageSize = async (ctx: RouterContext) => {
  const { url } = ctx.params as { url: string };
  const splited = url.split("=");
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
