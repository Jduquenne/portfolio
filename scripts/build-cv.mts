/**
 * Renders the CV to a static PDF + preview PNG per locale, at build time.
 * The `/cv` page then just serves these files — react-pdf never ships to the client.
 *
 * Run via `npm run build:cv` (also part of `npm run build`).
 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import * as mupdf from "mupdf";
import sharp from "sharp";
import { buildCvData, type CvTranslator } from "../src/components/cv/cvData";
import { routing } from "../src/i18n/routing";

const AVATAR = resolve("public/avatar.png");
/** Render scale for the preview raster, then downscaled to this width. */
const PREVIEW_SCALE = 2;
const PREVIEW_WIDTH = 900;

type Messages = { cv: Record<string, string> };

function makeTranslator(messages: Record<string, string>): CvTranslator {
  return ((key: string, values?: Record<string, number | string>) => {
    let text = messages[key] ?? key;
    if (!values) return text;
    text = text.replace(
      /\{(\w+),\s*plural,\s*one\s*\{([^}]*)\}\s*other\s*\{([^}]*)\}\}/g,
      (_all, name: string, one: string, other: string) => {
        const n = Number(values[name]);
        return (n === 1 ? one : other).replace(/#/g, String(n));
      },
    );
    return text.replace(/\{(\w+)\}/g, (_all, name: string) =>
      name in values ? String(values[name]) : `{${name}}`,
    );
  }) as CvTranslator;
}

function renderFirstPage(pdf: Uint8Array): Uint8Array {
  const doc = mupdf.Document.openDocument(pdf, "application/pdf");
  const pixmap = doc
    .loadPage(0)
    .toPixmap(
      mupdf.Matrix.scale(PREVIEW_SCALE, PREVIEW_SCALE),
      mupdf.ColorSpace.DeviceRGB,
      false,
    );
  return pixmap.asPNG();
}

function toPreview(png: Uint8Array): Promise<Buffer> {
  return sharp(Buffer.from(png))
    .resize({ width: PREVIEW_WIDTH })
    .webp({ quality: 80 })
    .toBuffer();
}

async function main() {
  // CvDocument reads its fonts from here — set before it is imported.
  process.env.CV_FONT_DIR = resolve("scripts/fonts");
  const { CvDocument } = await import("../src/components/cv/CvDocument");

  for (const locale of routing.locales) {
    const messages = JSON.parse(
      await readFile(resolve(`messages/${locale}.json`), "utf8"),
    ) as Messages;

    const data = buildCvData(locale, makeTranslator(messages.cv), AVATAR);
    const element = createElement(CvDocument, { data }) as Parameters<
      typeof renderToBuffer
    >[0];
    const pdf = await renderToBuffer(element);

    await writeFile(resolve(`public/cv-${locale}.pdf`), pdf);
    await writeFile(
      resolve(`public/cv-preview-${locale}.webp`),
      await toPreview(renderFirstPage(pdf)),
    );

    console.log(`[cv] ${locale} → cv-${locale}.pdf + cv-preview-${locale}.webp`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
