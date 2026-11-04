import { clamp, easeInOut, lerp } from "@/lib/availability/geo/math";
import { boundsOf } from "@/lib/availability/geo/shape";
import type { Point } from "@/lib/availability/types";

const GOLDEN_ANGLE = 2.39996;
const BALL_VERTICES = 10;
const BALL_PIXEL_RADIUS = 22;
const SPIN_DEGREES = 330;
const TILT_DEGREES = 10;

export interface Crumple {
  elapsed: number;
  points: readonly Point[];
  center: Point;
  crumpleSeconds: number;
  flySeconds: number;
}

export interface CrumpleFrame {
  path: Point[];
  ball: Point[];
  ballOpacity: number;
  center: Point;
  /** Where the paper ball is, in world units. */
  position: Point;
  rotation: number;
  scale: number;
  opacity: number;
}

/** A drawn line that collapses into a paper ball and flies off to a target. */
export function createCrumple(
  points: readonly Point[],
  crumpleSeconds: number,
  flySeconds: number,
): Crumple {
  const bounds = boundsOf(points);
  return {
    elapsed: 0,
    points,
    center: [(bounds.minX + bounds.maxX) / 2, (bounds.minY + bounds.maxY) / 2],
    crumpleSeconds,
    flySeconds,
  };
}

export function isCrumpleDone(crumple: Crumple): boolean {
  return crumple.elapsed >= crumple.crumpleSeconds + crumple.flySeconds;
}

const jitter = (index: number) => {
  const value = Math.sin(index * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

export function crumpleFrame(
  crumple: Crumple,
  pixelScale: number,
  target: Point,
): CrumpleFrame {
  const crumpled = easeInOut(clamp(crumple.elapsed / crumple.crumpleSeconds));
  const flight = clamp((crumple.elapsed - crumple.crumpleSeconds) / crumple.flySeconds);
  const flown = easeInOut(flight);
  const radius = BALL_PIXEL_RADIUS / pixelScale;
  const [cx, cy] = crumple.center;

  const path = crumple.points.map((point, i): Point => {
    const angle = i * GOLDEN_ANGLE;
    const reach = (0.2 + 0.8 * ((i * 0.618) % 1)) * radius;
    return [
      lerp(point[0], cx + reach * Math.cos(angle), crumpled),
      lerp(point[1], cy + reach * Math.sin(angle), crumpled),
    ];
  });

  const ball = Array.from({ length: BALL_VERTICES }, (_, i): Point => {
    const angle = (i / BALL_VERTICES) * 2 * Math.PI;
    const reach = radius * (0.8 + 0.35 * jitter(i));
    return [cx + reach * Math.cos(angle), cy + reach * Math.sin(angle)];
  });

  const dx = target[0] - cx;
  const dy = target[1] - cy;
  const control: Point = [cx + dx / 2 - dy * 0.28, cy + dy / 2 + dx * 0.28];
  const along = (from: number, via: number, to: number) =>
    (1 - flown) * (1 - flown) * from + 2 * (1 - flown) * flown * via + flown * flown * to;

  return {
    path,
    ball,
    ballOpacity: crumpled * crumpled * 0.9,
    center: crumple.center,
    position: [along(cx, control[0], target[0]), along(cy, control[1], target[1])],
    rotation: -TILT_DEGREES * crumpled - SPIN_DEGREES * flown,
    scale: 1 - 0.8 * flown,
    opacity: flight > 0.8 ? 1 - (flight - 0.8) / 0.2 : 1,
  };
}
