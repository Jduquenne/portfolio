/**
 * Bundles and runs scripts/build-cv.mts.
 *
 * A bundle step is needed because @react-pdf/renderer ships ESM-only subpath
 * exports that trip up on-the-fly TS loaders; esbuild resolves them cleanly.
 */
import { build } from "esbuild";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const outfile = resolve("scripts/dist/build-cv.mjs");

await build({
  entryPoints: ["scripts/build-cv.mts"],
  outfile,
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  jsx: "automatic",
});

await import(pathToFileURL(outfile).href);
