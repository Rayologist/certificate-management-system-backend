import {
  loadImage,
  createCanvas,
  registerFont,
  Canvas,
  CanvasRenderingContext2D,
  Image,
} from "canvas";
import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { Y } from "./constant";
import { TEMPLATE_PATH, FONT_ROOT, CERTIFICATE_ROOT } from "src/api/config";
import { Text } from "types";

registerFont(FONT_ROOT + "/Songti.ttf", { family: "Songti" });

export function calculateStartPixel(
  imageWidthOrHeight: number,
  sentencePixel: number
) {
  return (imageWidthOrHeight - sentencePixel) / 2;
}

export async function drawName(imageName: string, name: string) {
  const imagePath = path.join(CERTIFICATE_ROOT, imageName);
  const image = await loadImage(imagePath);
  const canvas = createCanvas(image.naturalWidth, image.naturalHeight);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

  ctx.font = '100px "Songti"';

  ctx.fillText(
    name,
    calculateStartPixel(image.naturalWidth, ctx.measureText(name).width),
    Y.name
  );
  return { canvas, ctx, image };
}

export async function drawCertificate(
  texts: Text[],
  hours: number,
  date: string
): Promise<{
  image: Image;
  canvas: Canvas;
  context: CanvasRenderingContext2D;
}> {
  const image = await loadImage(TEMPLATE_PATH);
  const canvas = createCanvas(image.naturalWidth, image.naturalHeight);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

  const fontSize = 65;
  const lineHeight = 110;
  const font = `${fontSize}px "Times New Roman"`;
  ctx.font = font;

  const extraHeight = texts.length === 3 ? 0 : 30;
  // event titles
  texts = [
    {
      text: "has attended the",
    },
    ...texts,
    {
      text: `With a total of ${hours} hour(s)`,
    },
    {
      text: `on ${date}`,
    },
  ];

  texts.forEach((text, index) => {
    const startHeight =
      Y.titleUpper + fontSize + (lineHeight + extraHeight) * index;

    if (text?.weight || text?.weight !== "") {
      ctx.font = text?.weight + " " + font;
    } else {
      ctx.font = font;
    }

    ctx.fillText(
      text.text,
      calculateStartPixel(image.naturalWidth, ctx.measureText(text.text).width),
      startHeight
    );
  });

  return { image, canvas, context: ctx };
}

export default async function generateCertificate(
  texts: Text[],
  hours: number,
  date: string
) {
  const { canvas } = await drawCertificate(texts, hours, date);

  // generate file name
  const hash = createHash("md5");
  hash.update(JSON.stringify({ texts, hours, date, now: new Date() }));
  const digest = hash.digest("hex");

  const filename = digest + ".png";
  const filePath = path.resolve(CERTIFICATE_ROOT, filename);
  await pipeline(canvas.createPNGStream(), fs.createWriteStream(filePath));

  // const doc = new PDFDocument({
  //   size: [image.naturalWidth, image.naturalHeight],
  // });
  // doc.pipe(fs.createWriteStream(filePath.replace("png", "pdf")));
  // doc.image(canvas.toBuffer(), 0, 0);
  // doc.end();
  return { url: digest, filename };
}
