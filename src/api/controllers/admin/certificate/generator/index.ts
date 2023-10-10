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
import Y from './constant';

registerFont(`${FONT_ROOT}/Songti.ttf`, { family: 'Songti' });

export function calculateStartPixel(imageWidthOrHeight: number, sentencePixel: number) {
  return (imageWidthOrHeight - sentencePixel) / 2;
}

export async function drawName(imageName: string, name: string) {
  const imagePath = path.join(CERTIFICATE_ROOT, imageName);
  const image = await loadImage(imagePath);
  const canvas = createCanvas(image.naturalWidth, image.naturalHeight);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

  ctx.font = '100px "Songti"';

  ctx.fillText(name, calculateStartPixel(image.naturalWidth, ctx.measureText(name).width), Y.name);
  return { canvas, ctx, image };
}

export async function drawCertificate(texts: Text[]): Promise<{
  image: Image;
  canvas: Canvas;
  context: CanvasRenderingContext2D;
}> {
  const image = await loadImage(TEMPLATE_PATH);
  const canvas = createCanvas(image.naturalWidth, image.naturalHeight);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

  const fontSize = 65;
  const lineHeight = 110;
  const font = `${fontSize}px "Times New Roman"`;
  ctx.font = font;

  const extraHeight = texts.length === 3 ? 0 : 30;

  texts.forEach((text, index) => {
    const startHeight = Y.titleUpper + fontSize + (lineHeight + extraHeight) * index;

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

export default async function generateCertificate(texts: Text[]) {
  const { canvas } = await drawCertificate(texts);

  // generate file name
  const hash = createHash('md5');
  hash.update(JSON.stringify({ texts, now: new Date() }));
  const digest = hash.digest('hex');

  const filename = `${digest}.png`;
  const filePath = path.resolve(CERTIFICATE_ROOT, filename);
  await pipeline(canvas.createPNGStream(), fs.createWriteStream(filePath));

  return { url: digest, filename };
}
