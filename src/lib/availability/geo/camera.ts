import { clamp } from "@/lib/availability/geo/math";
import type { Bounds, Camera, Insets, Point, Viewport } from "@/lib/availability/types";

export interface FrameOptions {
  padding: number;
  /** Pixels kept free on each side, for the content drawn over the map. */
  reserve: Insets;
  minLogScale?: number;
  maxLogScale?: number;
}

/** Fits `bounds` in the free part of the viewport, centred in what is left of it. */
export function frameFor(
  bounds: Bounds,
  viewport: Viewport,
  { padding, reserve, minLogScale = -Infinity, maxLogScale = Infinity }: FrameOptions,
): Camera {
  const freeWidth = Math.max(1, viewport.width - reserve.left - reserve.right - padding * 2);
  const freeHeight = Math.max(1, viewport.height - reserve.top - reserve.bottom - padding * 2);
  const fit = Math.min(
    freeWidth / (bounds.maxX - bounds.minX || 1),
    freeHeight / (bounds.maxY - bounds.minY || 1),
  );
  const logScale = clamp(Math.log(fit), minLogScale, maxLogScale);
  const scale = Math.exp(logScale);
  const centerX = reserve.left + (viewport.width - reserve.left - reserve.right) / 2;
  const centerY = reserve.top + (viewport.height - reserve.top - reserve.bottom) / 2;
  return {
    cx: (bounds.minX + bounds.maxX) / 2 - (centerX - viewport.width / 2) / scale,
    cy: (bounds.minY + bounds.maxY) / 2 - (centerY - viewport.height / 2) / scale,
    logScale,
  };
}

export function scaleOf(camera: Camera): number {
  return Math.exp(camera.logScale);
}

export function viewBoxOf(camera: Camera, viewport: Viewport): string {
  const scale = scaleOf(camera);
  const width = viewport.width / scale;
  const height = viewport.height / scale;
  return `${camera.cx - width / 2} ${camera.cy - height / 2} ${width} ${height}`;
}

export function screenToWorld(
  camera: Camera,
  viewport: Viewport,
  [px, py]: Point,
): Point {
  const scale = scaleOf(camera);
  return [
    camera.cx + (px - viewport.width / 2) / scale,
    camera.cy + (py - viewport.height / 2) / scale,
  ];
}

export function worldToScreen(
  camera: Camera,
  viewport: Viewport,
  [x, y]: Point,
): Point {
  const scale = scaleOf(camera);
  return [
    (x - (camera.cx - viewport.width / (2 * scale))) * scale,
    (y - (camera.cy - viewport.height / (2 * scale))) * scale,
  ];
}
