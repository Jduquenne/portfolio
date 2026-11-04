import * as THREE from "three";
import type { SceneNode } from "@/lib/constellation/engine/nodes";
import {
  BODY_FRAGMENT,
  BODY_VERTEX,
  LINE_FRAGMENT,
  LINE_VERTEX,
  NEBULA_FRAGMENT,
  TRAIL_FRAGMENT,
  TRAIL_VERTEX,
  nebulaVertex,
} from "@/lib/constellation/engine/shaders";
import { seededRandom } from "@/lib/constellation/math";
import type { Layout } from "@/lib/constellation/types";

export interface Uniforms {
  [name: string]: THREE.IUniform;
  uActive: THREE.IUniform<THREE.Vector4>;
  uTime: THREE.IUniform<number>;
  uDpr: THREE.IUniform<number>;
  uIntro: THREE.IUniform<number>;
  uDraw: THREE.IUniform<number>;
}

export interface Part {
  object: THREE.Object3D;
  dispose: () => void;
}

const STAGE_COUNT = 4;

/** Which suns a body or a line belongs to, as the four components of a vector. */
export function sunMask(suns: readonly number[]): number[] {
  return Array.from({ length: STAGE_COUNT }, (_, i) => (suns.includes(i) ? 1 : 0));
}

const additive = (uniforms: Uniforms, vertexShader: string, fragmentShader: string) =>
  new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

function points(geometry: THREE.BufferGeometry, material: THREE.Material): THREE.Points {
  const object = new THREE.Points(geometry, material);
  object.frustumCulled = false;
  return object;
}

/** A soft glow behind each sun. */
export function createNebulae(uniforms: Uniforms, suns: readonly THREE.Vector3[], compact: boolean): Part {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(suns.length * 3);
  const stages = new Float32Array(suns.length * 4);
  suns.forEach((sun, i) => {
    sun.toArray(positions, i * 3);
    stages.set(sunMask([i]), i * 4);
  });
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aStages", new THREE.BufferAttribute(stages, 4));
  const material = additive(uniforms, nebulaVertex(compact ? 380 : 640), NEBULA_FRAGMENT);
  return {
    object: points(geometry, material),
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}

export interface Bodies extends Part {
  /** Copies the node positions to the GPU. */
  sync: () => void;
  boost: Float32Array;
  points: THREE.Points;
  boostAttribute: THREE.BufferAttribute;
}

/** Suns, planets and tools as one set of point sprites: a single draw call. */
export function createBodies(uniforms: Uniforms, nodes: readonly SceneNode[]): Bodies {
  const random = seededRandom(5);
  const count = nodes.length;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const stages = new Float32Array(count * 4);
  const phases = new Float32Array(count);
  const kinds = new Float32Array(count);
  const levels = new Float32Array(count).fill(-1);
  const boost = new Float32Array(count);

  nodes.forEach((node, i) => {
    sizes[i] = node.size;
    stages.set(sunMask(node.suns), i * 4);
    phases[i] = random();
    kinds[i] = node.kind === "sun" ? 0 : node.kind === "planet" ? 1 : 2;
    if (node.kind === "tool" && node.level) levels[i] = node.level / 5;
  });

  const geometry = new THREE.BufferGeometry();
  const positionAttribute = new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage);
  const boostAttribute = new THREE.BufferAttribute(boost, 1).setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("position", positionAttribute);
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aStages", new THREE.BufferAttribute(stages, 4));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute("aKind", new THREE.BufferAttribute(kinds, 1));
  geometry.setAttribute("aLevel", new THREE.BufferAttribute(levels, 1));
  geometry.setAttribute("aBoost", boostAttribute);

  const material = additive(uniforms, BODY_VERTEX, BODY_FRAGMENT);
  const object = points(geometry, material);

  return {
    object,
    points: object,
    boost,
    boostAttribute,
    sync: () => {
      nodes.forEach((node, i) => node.position.toArray(positions, i * 3));
      positionAttribute.needsUpdate = true;
    },
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}

interface Segment {
  from: THREE.Vector3;
  to: THREE.Vector3;
  suns: readonly number[];
  /** Where on the draw-in (0 to 1) the segment starts and ends. */
  start: number;
  end: number;
  weight: number;
}

export interface Lines extends Part {
  /** Re-reads the end points, for lines that follow moving bodies. */
  sync: () => void;
}

function createLines(uniforms: Uniforms, segments: readonly Segment[]): Lines {
  const count = segments.length;
  const positions = new Float32Array(count * 6);
  const stages = new Float32Array(count * 8);
  const order = new Float32Array(count * 2);
  const weight = new Float32Array(count * 2);
  segments.forEach((segment, i) => {
    const mask = sunMask(segment.suns);
    stages.set(mask, i * 8);
    stages.set(mask, i * 8 + 4);
    order[i * 2] = segment.start;
    order[i * 2 + 1] = segment.end;
    weight[i * 2] = weight[i * 2 + 1] = segment.weight;
  });

  const geometry = new THREE.BufferGeometry();
  const positionAttribute = new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("position", positionAttribute);
  geometry.setAttribute("aStages", new THREE.BufferAttribute(stages, 4));
  geometry.setAttribute("aO", new THREE.BufferAttribute(order, 1));
  geometry.setAttribute("aW", new THREE.BufferAttribute(weight, 1));
  const material = additive(uniforms, LINE_VERTEX, LINE_FRAGMENT);
  const object = new THREE.LineSegments(geometry, material);
  object.frustumCulled = false;

  const sync = () => {
    segments.forEach((segment, i) => {
      segment.from.toArray(positions, i * 6);
      segment.to.toArray(positions, i * 6 + 3);
    });
    positionAttribute.needsUpdate = true;
  };
  sync();

  return {
    object,
    sync,
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}

const RING_SEGMENTS = 72;

/** The orbit of every planet, very faint, behind everything. */
export function createOrbitRings(uniforms: Uniforms, nodes: readonly SceneNode[]): Lines {
  const segments: Segment[] = [];
  for (const node of nodes) {
    if (node.kind !== "planet") continue;
    const at = (angle: number) =>
      node.center
        .clone()
        .addScaledVector(node.u, Math.cos(angle) * node.radius)
        .addScaledVector(node.w, Math.sin(angle) * node.radius);
    for (let k = 0; k < RING_SEGMENTS; k++) {
      segments.push({
        from: at((k / RING_SEGMENTS) * Math.PI * 2),
        to: at(((k + 1) / RING_SEGMENTS) * Math.PI * 2),
        suns: node.suns,
        start: 0.25,
        end: 0.25,
        weight: 0.12,
      });
    }
  }
  return createLines(uniforms, segments);
}

/** The edges of the tree: planet to its suns, tool to its planet. They move with the bodies. */
export function createTreeEdges(uniforms: Uniforms, nodes: readonly SceneNode[]): Lines {
  const segments: Segment[] = [];
  for (const node of nodes) {
    if (node.kind === "planet") {
      for (const sun of node.suns) {
        segments.push({ from: node.position, to: nodes[sun].position, suns: [sun], start: 0.35, end: 0.35, weight: 0.3 });
      }
    } else if (node.kind === "tool") {
      segments.push({ from: nodes[node.parent].position, to: node.position, suns: node.suns, start: 0.35, end: 0.35, weight: 0.3 });
    }
  }
  return createLines(uniforms, segments);
}

/** The path between the four suns, drawn in first. */
export function createSpine(uniforms: Uniforms, suns: readonly THREE.Vector3[]): Lines {
  const segments: Segment[] = [];
  for (let i = 0; i < suns.length - 1; i++) {
    segments.push({
      from: suns[i],
      to: suns[i + 1],
      suns: [i, i + 1],
      start: i / (suns.length - 1),
      end: (i + 1) / (suns.length - 1),
      weight: 0.7,
    });
  }
  return createLines(uniforms, segments);
}

export const TRAIL_LENGTH = 16;

export interface Trail extends Part {
  positions: THREE.BufferAttribute;
}

/** A comet: a short fading line of points, moved by the caller. */
export function createTrail(uniforms: Uniforms): Trail {
  const geometry = new THREE.BufferGeometry();
  const positions = new THREE.BufferAttribute(new Float32Array(TRAIL_LENGTH * 3), 3).setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("position", positions);
  geometry.setAttribute(
    "aT",
    new THREE.BufferAttribute(Float32Array.from({ length: TRAIL_LENGTH }, (_, i) => i / TRAIL_LENGTH), 1),
  );
  const material = additive(uniforms, TRAIL_VERTEX, TRAIL_FRAGMENT);
  return {
    object: points(geometry, material),
    positions,
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}

function dotTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 32;
  const context = canvas.getContext("2d");
  if (context) {
    const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "#fff");
    gradient.addColorStop(0.35, "rgba(255,255,255,.7)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 32, 32);
  }
  return new THREE.CanvasTexture(canvas);
}

/** A band of dust and a few brighter stars, at many depths. */
export function createSky(compact: boolean): Part {
  const random = seededRandom(23);
  const gauss = () => random() + random() + random() - 1.5;
  const texture = dotTexture();
  const group = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [texture];

  const layer = (count: number, size: number, opacity: number, band: number) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      if (random() < band) {
        const x = (random() - 0.5) * 56;
        positions.set([x, x * 0.32 + gauss() * 3.5, gauss() * 16 - 6], i * 3);
      } else {
        positions.set([(random() - 0.5) * 56, (random() - 0.5) * 30, (random() - 0.5) * 30], i * 3);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xf8fafc,
      map: texture,
      size,
      transparent: true,
      opacity,
      depthWrite: false,
      sizeAttenuation: true,
    });
    disposables.push(geometry, material);
    group.add(new THREE.Points(geometry, material));
  };
  layer(compact ? 500 : 1800, 0.03, 0.38, 0.7);
  layer(compact ? 90 : 260, 0.09, 0.7, 0.4);

  return { object: group, dispose: () => disposables.forEach((item) => item.dispose()) };
}

export function sunPoints(layout: Layout): THREE.Vector3[] {
  return layout.suns.map((s) => new THREE.Vector3(s[0], s[1], s[2]));
}

