import { lerp } from "@/lib/availability/geo/math";
import type { Bounds, Point } from "@/lib/availability/types";

export interface Shape {
  readonly points: readonly Point[];
  readonly cumulative: readonly number[];
  readonly length: number;
}

export function createShape(points: readonly Point[]): Shape {
  const cumulative = [0];
  for (let i = 1; i < points.length; i++) {
    cumulative.push(
      cumulative[i - 1] +
        Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]),
    );
  }
  return { points, cumulative, length: cumulative[cumulative.length - 1] };
}

export function pointAtProgress(shape: Shape, progress: number): Point {
  const target = shape.length * progress;
  for (let i = 1; i < shape.points.length; i++) {
    if (shape.cumulative[i] >= target) {
      const span = shape.cumulative[i] - shape.cumulative[i - 1] || 1;
      const t = (target - shape.cumulative[i - 1]) / span;
      const a = shape.points[i - 1];
      const b = shape.points[i];
      return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
    }
  }
  return shape.points[shape.points.length - 1];
}

/** The part of the shape that has been drawn once `progress` of it is done. */
export function drawnPoints(shape: Shape, progress: number): Point[] {
  if (progress <= 0) return [];
  if (progress >= 1) return [...shape.points];
  const target = shape.length * progress;
  const drawn: Point[] = [shape.points[0]];
  for (let i = 1; i < shape.points.length; i++) {
    if (shape.cumulative[i] <= target) {
      drawn.push(shape.points[i]);
    } else {
      drawn.push(pointAtProgress(shape, progress));
      break;
    }
  }
  return drawn;
}

export function boundsOf(points: readonly Point[]): Bounds {
  const bounds: Bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  for (const [x, y] of points) {
    bounds.minX = Math.min(bounds.minX, x);
    bounds.minY = Math.min(bounds.minY, y);
    bounds.maxX = Math.max(bounds.maxX, x);
    bounds.maxY = Math.max(bounds.maxY, y);
  }
  return bounds;
}

export function toPathData(points: readonly Point[], close = false): string {
  const body = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join("");
  return close ? `${body}Z` : body;
}
