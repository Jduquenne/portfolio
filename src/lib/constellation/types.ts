import type { LocalizedString } from "@/types";

export type Level = 1 | 2 | 3 | 4 | 5;

export interface SunData {
  name: LocalizedString;
  hint: LocalizedString;
}

export interface ToolData {
  /** A product name, written as its owner writes it: never translated. */
  name: string;
  level?: Level;
  note?: LocalizedString;
}

export interface PlanetData {
  id: string;
  name: LocalizedString;
  /** Indexes into `ConstellationData.suns`. A planet between several suns links them. */
  suns: readonly number[];
  note?: LocalizedString;
  tools: readonly ToolData[];
}

export type SunTuple = readonly [SunData, SunData, SunData, SunData];

export interface ConstellationData {
  designation: string;
  suns: SunTuple;
  planets: readonly PlanetData[];
}

export interface SunView {
  index: number;
  name: string;
  hint: string;
}

export interface ToolView {
  id: string;
  name: string;
  level: Level | null;
  levelLabel: string | null;
  note: string | null;
}

export interface PlanetView {
  id: string;
  name: string;
  note: string | null;
  suns: readonly number[];
  tools: readonly ToolView[];
}

/** The data in one language, ready for the interface. */
export interface ConstellationModel {
  designation: string;
  suns: readonly SunView[];
  planets: readonly PlanetView[];
}

export type Vec3 = readonly [number, number, number];

/** A body that goes around a point on a tilted ellipse. */
export interface Orbit {
  radius: number;
  /** The two axes of the ellipse (the second one already flattened). */
  u: Vec3;
  w: Vec3;
  phase: number;
  /** Radians per second. */
  omega: number;
}

export interface PlanetLayout extends Orbit {
  anchor: Vec3;
  /** Point size of the node, before perspective. */
  size: number;
}

export interface ToolLayout extends Orbit {
  size: number;
}

export type LayoutKind = "wide" | "tall";

export interface Layout {
  kind: LayoutKind;
  suns: readonly Vec3[];
  planets: readonly PlanetLayout[];
  /** Same order as `ConstellationModel.planets`, then as the tools of each planet. */
  tools: readonly (readonly ToolLayout[])[];
}

export interface ConstellationState {
  /** The sun the camera is focused on, or null for the whole constellation. */
  sun: number | null;
  planet: string | null;
  /** Id of the tool lit in the scene (hover or tap on its row). */
  tool: string | null;
}
