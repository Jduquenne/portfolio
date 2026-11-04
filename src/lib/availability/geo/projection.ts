import type { LatLon, Point } from "@/lib/availability/types";

const EARTH_RADIUS_KM = 6371;
const SOUTH_LATITUDE = 41.3;
const NORTH_LATITUDE = 51.15;
const WEST_LONGITUDE = -5;
const FRANCE_HEIGHT_UNITS = 1000;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const mercatorY = (latitude: number) =>
  Math.log(Math.tan(Math.PI / 4 + toRadians(latitude) / 2));

const NORTH = mercatorY(NORTH_LATITUDE);
const SCALE = FRANCE_HEIGHT_UNITS / (NORTH - mercatorY(SOUTH_LATITUDE));

/** Mercator, so that a radius in kilometres stays a true circle on the map. */
export function project([latitude, longitude]: LatLon): Point {
  return [
    SCALE * (toRadians(longitude) - toRadians(WEST_LONGITUDE)),
    SCALE * (NORTH - mercatorY(latitude)),
  ];
}

export function distanceKm(a: LatLon, b: LatLon): number {
  const dLat = toRadians(b[0] - a[0]);
  const dLon = toRadians(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a[0])) * Math.cos(toRadians(b[0])) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

export function kmToUnits(km: number, atLatitude: number): number {
  return (SCALE * (km / EARTH_RADIUS_KM)) / Math.cos(toRadians(atLatitude));
}

export function circlePoints(
  center: Point,
  radius: number,
  segments = 96,
): Point[] {
  return Array.from({ length: segments + 1 }, (_, i) => {
    const angle = (2 * Math.PI * i) / segments;
    return [
      center[0] + radius * Math.cos(angle),
      center[1] + radius * Math.sin(angle),
    ] as const;
  });
}
