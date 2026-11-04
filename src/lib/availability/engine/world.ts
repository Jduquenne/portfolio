import { MAP_CITIES } from "@/lib/availability/data/cities";
import { ORIGIN, RADIUS_KM } from "@/lib/availability/data/config";
import {
  CORSICA_OUTLINE,
  FRANCE_OUTLINE,
  HAUTS_DE_FRANCE_OUTLINE,
} from "@/lib/availability/data/geography";
import { ROUTES } from "@/lib/availability/data/routes";
import {
  circlePoints,
  distanceKm,
  kmToUnits,
  project,
} from "@/lib/availability/geo/projection";
import { boundsOf, createShape, type Shape } from "@/lib/availability/geo/shape";
import type {
  Bounds,
  CityScope,
  LabelSide,
  LatLon,
  MapCity,
  Point,
} from "@/lib/availability/types";

export type OutlineId = "france" | "corsica" | "region" | "radius";

export interface WorldRoute {
  cityId: string;
  shape: Shape;
  distanceKm: number;
  durationMin: number;
}

export interface WorldCity {
  id: string;
  source: MapCity;
  position: Point;
  scope: CityScope;
  labelSide: LabelSide;
  /** Set only for a city inside the radius that has a road route. */
  route: WorldRoute | null;
}

export interface World {
  origin: { id: string; position: Point; latLon: LatLon };
  radiusKm: number;
  radiusUnits: number;
  outlines: Record<OutlineId, Shape>;
  cities: readonly WorldCity[];
  bounds: { france: Bounds; region: Bounds; radius: Bounds };
}

/** Everything the scene draws, projected once from the raw data. */
export function buildWorld(): World {
  const originPosition = project(ORIGIN.position);
  const radiusUnits = kmToUnits(RADIUS_KM, ORIGIN.position[0]);

  const outlines: Record<OutlineId, Shape> = {
    france: createShape([...FRANCE_OUTLINE.map(project), project(FRANCE_OUTLINE[0])]),
    corsica: createShape(CORSICA_OUTLINE.map(project)),
    region: createShape(HAUTS_DE_FRANCE_OUTLINE.map(project)),
    radius: createShape(circlePoints(originPosition, radiusUnits)),
  };

  const cities = MAP_CITIES.map((city): WorldCity => {
    const position = project(city.position);
    const route = ROUTES.find((candidate) => candidate.cityId === city.id);
    const inRange = distanceKm(ORIGIN.position, city.position) <= RADIUS_KM;
    const routePoints = route
      ? [originPosition, ...route.path.slice(1, -1).map(project), position]
      : [];
    return {
      id: city.id,
      source: city,
      position,
      scope: city.scope,
      labelSide: city.labelSide ?? "e",
      route:
        route && inRange
          ? {
              cityId: city.id,
              shape: createShape(routePoints),
              distanceKm: route.distanceKm,
              durationMin: route.durationMin,
            }
          : null,
    };
  });

  return {
    origin: { id: ORIGIN.id, position: originPosition, latLon: ORIGIN.position },
    radiusKm: RADIUS_KM,
    radiusUnits,
    outlines,
    cities,
    bounds: {
      france: boundsOf([...outlines.france.points, ...outlines.corsica.points]),
      region: boundsOf([...outlines.region.points, ...outlines.radius.points]),
      radius: boundsOf(outlines.radius.points),
    },
  };
}

export function appearsIn(scope: CityScope, mode: "onsite" | "remote"): boolean {
  return scope === "both" || (mode === "onsite" ? scope === "regional" : scope === "national");
}
