import type { LocalizedString } from "@/types";

export type LatLon = readonly [latitude: number, longitude: number];
export type Point = readonly [x: number, y: number];

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface Viewport {
  width: number;
  height: number;
}

export interface Insets {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface Camera {
  cx: number;
  cy: number;
  logScale: number;
}

export type MapMode = "onsite" | "remote";
export type LabelSide = "e" | "w" | "n" | "s";
export type CityScope = "national" | "regional" | "both";

export interface MapCity {
  id: string;
  name: LocalizedString;
  position: LatLon;
  scope: CityScope;
  labelSide?: LabelSide;
}

export interface MapOrigin {
  id: string;
  name: LocalizedString;
  position: LatLon;
}

export interface CityRoute {
  cityId: string;
  distanceKm: number;
  durationMin: number;
  path: readonly LatLon[];
}

export type ScenePhase = "idle" | "drawing" | "ready";

export interface SceneState {
  phase: ScenePhase;
  mode: MapMode;
  selectedCityId: string | null;
}
