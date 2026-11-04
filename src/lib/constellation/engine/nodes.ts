import * as THREE from "three";
import type {
  ConstellationModel,
  Layout,
  Orbit,
  Vec3,
} from "@/lib/constellation/types";

export type NodeKind = "sun" | "planet" | "tool";

/** A body of the scene: a sun, a planet or a tool. */
export interface SceneNode {
  /** The id of its label in the DOM (`data-node`). */
  id: string;
  kind: NodeKind;
  suns: readonly number[];
  size: number;
  /** 0 when the tool has no level. */
  level: number;
  position: THREE.Vector3;
  /** What it goes around: a fixed point, or (for a tool) the live position of its planet. */
  center: THREE.Vector3;
  u: THREE.Vector3;
  w: THREE.Vector3;
  radius: number;
  phase: number;
  omega: number;
  /** Index of the planet node a tool belongs to, else -1. */
  parent: number;
}

const vec = (v: Vec3) => new THREE.Vector3(v[0], v[1], v[2]);

function still(center: THREE.Vector3): Pick<SceneNode, "center" | "u" | "w" | "radius" | "phase" | "omega"> {
  return {
    center,
    u: new THREE.Vector3(1, 0, 0),
    w: new THREE.Vector3(0, 1, 0),
    radius: 0,
    phase: 0,
    omega: 0,
  };
}

function orbitOf(orbit: Orbit) {
  return {
    u: vec(orbit.u),
    w: vec(orbit.w),
    radius: orbit.radius,
    phase: orbit.phase,
    omega: orbit.omega,
  };
}

/** Suns first, then planets, then tools: a planet is always placed before its tools. */
export function buildNodes(model: ConstellationModel, layout: Layout): SceneNode[] {
  const nodes: SceneNode[] = model.suns.map((sun, i) => ({
    id: `sun-${sun.index}`,
    kind: "sun",
    suns: [i],
    size: 70,
    level: 0,
    position: vec(layout.suns[i]),
    parent: -1,
    ...still(vec(layout.suns[i])),
  }));

  const planetNode = new Map<number, number>();
  model.planets.forEach((planet, i) => {
    const placed = layout.planets[i];
    planetNode.set(i, nodes.length);
    nodes.push({
      id: planet.id,
      kind: "planet",
      suns: planet.suns,
      size: placed.size,
      level: 0,
      position: vec(placed.anchor),
      center: vec(placed.anchor),
      parent: -1,
      ...orbitOf(placed),
    });
  });

  model.planets.forEach((planet, i) => {
    const parent = planetNode.get(i) ?? -1;
    planet.tools.forEach((tool, j) => {
      const placed = layout.tools[i][j];
      nodes.push({
        id: tool.id,
        kind: "tool",
        suns: planet.suns,
        size: placed.size,
        level: tool.level ?? 0,
        position: new THREE.Vector3(),
        center: nodes[parent].position,
        parent,
        ...orbitOf(placed),
      });
    });
  });

  return nodes;
}

/** Moves every body along its orbit to time `t` (seconds). */
export function placeNodes(nodes: readonly SceneNode[], t: number): void {
  for (const node of nodes) {
    const angle = node.phase + node.omega * t;
    node.position
      .copy(node.center)
      .addScaledVector(node.u, Math.cos(angle) * node.radius)
      .addScaledVector(node.w, Math.sin(angle) * node.radius);
  }
}
