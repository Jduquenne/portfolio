/**
 * Renders the Open Graph / social preview card to a static PNG at build time.
 * The site then serves `public/og.png` — referenced from every page's metadata.
 *
 * Run via `npm run build:og` (also part of `npm run build`). Output is
 * deterministic; commit the regenerated `public/og.png`.
 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createElement as h } from "react";
import { ImageResponse } from "next/og.js";

const WIDTH = 1200;
const HEIGHT = 630;

const COLORS = {
  base: "#020617",
  surface: "#0F172A",
  accent: "#38BDF8",
  contrast: "#F8FAFC",
  muted: "#94A3B8",
  faint: "#1E293B",
};

// Kept in English on purpose: the card is shared for both locales.
const NAME = "Jason Duquenne";
const SUBTITLE = "Fullstack Developer · JavaScript";
const TAGLINE =
  "Into 3D and Three.js. Building precise, human software that fades into the background through sheer efficiency.";
const URL = "jduquenne.github.io/portfolio";

const [mono500, mono700] = await Promise.all([
  readFile(resolve("scripts/fonts/geist-mono-500.woff")),
  readFile(resolve("scripts/fonts/geist-mono-700.woff")),
]);

const card = h(
  "div",
  {
    style: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: "100%",
      height: "100%",
      padding: 64,
      backgroundColor: COLORS.base,
      backgroundImage: `linear-gradient(${COLORS.faint} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.faint} 1px, transparent 1px)`,
      backgroundSize: "48px 48px",
      fontFamily: "Geist Mono",
      color: COLORS.contrast,
    },
  },
  h(
    "div",
    { style: { display: "flex", fontSize: 24, color: COLORS.accent } },
    "// portfolio",
  ),
  h(
    "div",
    { style: { display: "flex", flexDirection: "column" } },
    h(
      "div",
      {
        style: {
          display: "flex",
          fontSize: 76,
          fontWeight: 700,
          letterSpacing: -1,
        },
      },
      NAME,
    ),
    h(
      "div",
      {
        style: {
          display: "flex",
          fontSize: 30,
          color: COLORS.accent,
          marginTop: 16,
        },
      },
      SUBTITLE,
    ),
    h(
      "div",
      {
        style: {
          display: "flex",
          fontSize: 26,
          lineHeight: 1.5,
          color: COLORS.muted,
          marginTop: 32,
          maxWidth: 880,
        },
      },
      TAGLINE,
    ),
  ),
  h(
    "div",
    { style: { display: "flex", fontSize: 22, color: COLORS.muted } },
    URL,
  ),
);

const image = new ImageResponse(card, {
  width: WIDTH,
  height: HEIGHT,
  fonts: [
    { name: "Geist Mono", data: mono500, weight: 500, style: "normal" },
    { name: "Geist Mono", data: mono700, weight: 700, style: "normal" },
  ],
});

const buffer = Buffer.from(await image.arrayBuffer());
await writeFile(resolve("public/og.png"), buffer);

console.log(`build:og — wrote public/og.png (${buffer.length} bytes)`);
