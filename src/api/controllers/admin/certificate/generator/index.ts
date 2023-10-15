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
import { FONT_ROOT, CERTIFICATE_ROOT } from '@config';
import { Text } from 'types';

registerFont(`${FONT_ROOT}/Lantinghei-Demibold.ttf`, { family: 'Lantinghei' });
registerFont(`${FONT_ROOT}/HelveticaNeue-Bold.ttf`, { family: 'Helvetica Neue' });

export async function createCertGraph(...paths: string[]): Promise<CertGraph> {
  const image = await loadImage(path.resolve(...paths));
  const canvas = createCanvas(image.naturalWidth, image.naturalHeight);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
  return { canvas, ctx, image };
}

export function calculateStartPixel(imageWidthOrHeight: number, sentencePixel: number) {
  return (imageWidthOrHeight - sentencePixel) / 2;
}

export function renderName(args: {
  username: string;
  config: { namePositionY: number };
  certGraph: CertGraph;
}): CertGraph {
  const { username, config, certGraph } = args;
  const { ctx, image, canvas } = certGraph;

  ctx.font = '120px "Noto"';
  ctx.fillStyle = '#30788A';
  ctx.fillText(
    username,
    calculateStartPixel(image.naturalWidth, ctx.measureText(username).width),
    config.namePositionY,
  );
  return { canvas, ctx, image };
}

export function renderCertificate(args: RenderCertificateArgs): CertGraph {
  const { texts, config, certGraph } = args;
  const { ctx, image, canvas } = certGraph;

  const fontSize = 62;
  const lineHeight = 100;
  const font = `${fontSize}px "Times New Roman"`;
  ctx.font = font;

  const extraLineHeight = texts.length >= 5 ? 5 : 25;

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

  return { image, canvas, ctx };
}

export default async function savaCertificate(args: { texts: Text[]; certGraph: CertGraph }) {
  const {
    texts,
    certGraph: { canvas },
  } = args;

  // generate file name
  const hash = createHash('md5');
  hash.update(JSON.stringify({ texts, now: new Date() }));
  const digest = hash.digest('hex');

  const filename = `${digest}.png`;
  const filePath = path.resolve(CERTIFICATE_ROOT, filename);
  await pipeline(canvas.createPNGStream(), fs.createWriteStream(filePath));

  return { url: digest, filename };
}

export type RenderCertificateArgs = {
  texts: Text[];
  config: {
    namePositionY: number;
    titleUpperLimitY: number;
    titleLowerLimitY: number;
  };
  certGraph: CertGraph;
};

export type CertGraph = {
  canvas: Canvas;
  ctx: CanvasRenderingContext2D;
  image: Image;
};
