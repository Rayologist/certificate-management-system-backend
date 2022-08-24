import { RouterContext } from "@koa/router";
import fs from "fs";
import sharp, { ResizeOptions, Sharp } from "sharp";

import etag from "etag";
import parseImageSize from "./imageSizeParser";

const resizeImage = async (ctx: RouterContext) => {
  await parseImageSize(ctx);

  if (ctx.imageSize) {
    let { width, height } = ctx.imageSize as ResizeOptions;

    width = Number.isNaN(width) ? undefined : width;
    height = Number.isNaN(height) ? undefined : height;

    // set maximum width
    if (width && width > 1200) {
      width = 1200;
    }

    // set maximum height
    if (height && height > 800) {
      height = 800;
    }

    const transformWidth = sharp().resize({ width, height });
    ctx.body = (ctx.body as fs.ReadStream).pipe(transformWidth);

    // set etag for resized images
    const buffer = await (ctx.body as Sharp).toBuffer();
    ctx.response.etag = etag(buffer);
  }
};

export default resizeImage;
