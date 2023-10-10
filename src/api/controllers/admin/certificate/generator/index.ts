import {
  loadImage,
  createCanvas,
  registerFont,
  Canvas,
  CanvasRenderingContext2D,
  Image,
} from 'canvas';
import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { TEMPLATE_PATH, FONT_ROOT, CERTIFICATE_ROOT } from '@config';
import { Text } from 'types';

registerFont(`${FONT_ROOT}/Songti.ttf`, { family: 'Songti' });

export function calculateStartPixel(imageWidthOrHeight: number, sentencePixel: number) {
  return (imageWidthOrHeight - sentencePixel) / 2;
}

export async function drawUsername(args: {
  username: string;
  config: { namePositionY: number; imageFilename: string };
}) {
  const { username, config } = args;
  const imagePath = path.join(CERTIFICATE_ROOT, config.imageFilename);
  const image = await loadImage(imagePath);
  const canvas = createCanvas(image.naturalWidth, image.naturalHeight);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

  ctx.font = '100px "Songti"';

  ctx.fillText(
    username,
    calculateStartPixel(image.naturalWidth, ctx.measureText(username).width),
    config.namePositionY,
  );
  return { canvas, ctx, image };
}

export async function drawCertificate(args: DrawCertificateArgs): Promise<{
  image: Image;
  canvas: Canvas;
  context: CanvasRenderingContext2D;
}> {
  const { texts, config } = args;
  const image = await loadImage(path.resolve(TEMPLATE_PATH, config.templateFilename));
  const canvas = createCanvas(image.naturalWidth, image.naturalHeight);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

  const fontSize = 65;
  const lineHeight = 120;
  const font = `${fontSize}px "Times New Roman"`;
  ctx.font = font;

  const extraLineHeight = 30;

  texts.forEach((text, index) => {
    const startHeight = config.titleUpperLimitY + fontSize + (lineHeight + extraLineHeight) * index;

    if (text?.weight || text?.weight !== '') {
      ctx.font = `${text?.weight} ${font}`;
    } else {
      ctx.font = font;
    }

    ctx.fillText(
      text.text,
      calculateStartPixel(image.naturalWidth, ctx.measureText(text.text).width),
      startHeight,
    );
  });

  return { image, canvas, context: ctx };
}

export default async function generateCertificate(args: DrawCertificateArgs) {
  const { texts } = args;
  const { canvas } = await drawCertificate(args);

  // generate file name
  const hash = createHash('md5');
  hash.update(JSON.stringify({ texts, now: new Date() }));
  const digest = hash.digest('hex');

  const filename = `${digest}.png`;
  const filePath = path.resolve(CERTIFICATE_ROOT, filename);
  await pipeline(canvas.createPNGStream(), fs.createWriteStream(filePath));

  return { url: digest, filename };
}

export type DrawCertificateArgs = {
  texts: Text[];
  config: {
    templateFilename: string;
    namePositionY: number;
    titleUpperLimitY: number;
    titleLowerLimitY: number;
  };
};
