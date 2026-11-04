import {
  add,
  clamp,
  cross,
  length,
  normalize,
  scale,
  seededRandom,
  sub,
} from "@/lib/constellation/math";
import type {
  ConstellationModel,
  Layout,
  LayoutKind,
  Orbit,
  PlanetLayout,
  ToolLayout,
  Vec3,
} from "@/lib/constellation/types";

const SUN_POSITIONS: Record<LayoutKind, readonly Vec3[]> = {
  wide: [[-10.5, -1.5, 0], [-3.6, 2.4, 3], [3.6, -2.4, -3], [10.5, 1.5, 0]],
  tall: [[-1.5, 6, 0], [1.5, 2, 1.5], [-1.5, -2, -1.5], [1.5, -6, 0]],
};

/** How far a planet may drift from its sun, per layout. */
const LIMITS: Record<LayoutKind, Vec3> = {
  wide: [13, 6.5, 4],
  tall: [3.2, 8.5, 4],
};

const SCALE: Record<LayoutKind, number> = { wide: 1, tall: 0.62 };

const SEED = 11;
const RELAX_STEPS = 400;
const TOOL_SIZE = 26;

function planetSize(sunCount: number): number {
  if (sunCount >= 3) return 48;
  return sunCount === 2 ? 42 : 38;
}

interface Group {
  planets: number[];
  fixed: boolean;
  extent: number;
  position: Vec3;
  home: Vec3;
}

/**
 * Places the suns, gives every planet an orbit and every tool a small orbit
 * around its planet. Planets that share suns are pushed apart so they do not
 * pile up between them. Pure: the same model gives the same layout.
 */
export function computeLayout(model: ConstellationModel, kind: LayoutKind): Layout {
  const random = seededRandom(SEED);
  const gauss = () => random() + random() + random() - 1.5;
  const suns = SUN_POSITIONS[kind];
  const k = SCALE[kind];

  const keys = new Map<string, number[]>();
  model.planets.forEach((planet, index) => {
    const key = [...planet.suns].sort().join();
    keys.set(key, [...(keys.get(key) ?? []), index]);
  });

  const orbits = new Map<number, Orbit & { anchor: Vec3; size: number }>();
  const groups: Group[] = [];

  for (const indexes of keys.values()) {
    const first = model.planets[indexes[0]];
    const fixed = first.suns.length === 1;
    const centre = scale(
      first.suns.reduce<Vec3>((sum, s) => add(sum, suns[s]), [0, 0, 0]),
      1 / first.suns.length,
    );
    indexes.forEach((planetIndex, position) => {
      const radius = ((fixed ? 2.5 : 1) + position * (fixed ? 1.15 : 1.2)) * k;
      const normal = normalize([(random() - 0.5) * 1.1, (random() - 0.5) * 1.1, 1]);
      const u = normalize(cross(normal, [0, 1, 0.001]));
      const w = scale(normalize(cross(normal, u)), 0.8);
      orbits.set(planetIndex, {
        anchor: centre,
        size: planetSize(first.suns.length),
        radius,
        u,
        w,
        phase: (position / indexes.length) * Math.PI * 2 + random(),
        omega: 0.32 / Math.pow(radius + 0.5, 0.6),
      });
    });
    const extent =
      Math.max(...indexes.map((i) => orbits.get(i)?.radius ?? 0)) + 0.7;
    groups.push({ planets: indexes, fixed, extent, position: centre, home: centre });
  }

  relax(groups, LIMITS[kind], random);
  for (const group of groups) {
    for (const index of group.planets) {
      const orbit = orbits.get(index);
      if (orbit) orbit.anchor = group.position;
    }
  }

  const planets: PlanetLayout[] = model.planets.map((_, index) => {
    const orbit = orbits.get(index);
    if (!orbit) throw new Error(`No orbit for planet ${index}`);
    return orbit;
  });

  const tools: ToolLayout[][] = model.planets.map((planet) =>
    planet.tools.map((_, index) => {
      const normal = normalize([gauss(), gauss(), gauss() + 0.3]);
      const u = normalize(cross(normal, [0.3, 1, 0.1]));
      return {
        radius: (0.5 + index * 0.18) * k,
        u,
        w: normalize(cross(normal, u)),
        phase: random() * Math.PI * 2,
        omega: 1.1 + random() * 0.8,
        size: TOOL_SIZE,
      };
    }),
  );

  return { kind, suns, planets, tools };
}

function relax(groups: Group[], limits: Vec3, random: () => number): void {
  for (let step = 0; step < RELAX_STEPS; step++) {
    for (const a of groups) {
      if (a.fixed) continue;
      for (const b of groups) {
        if (a === b) continue;
        const gap = sub(a.position, b.position);
        const distance = length(gap);
        const wanted = a.extent + b.extent;
        if (distance >= wanted) continue;
        const direction =
          distance < 1e-3
            ? normalize([random() - 0.5, random() - 0.5, random() - 0.5])
            : scale(gap, 1 / distance);
        const push = scale(direction, (wanted - distance) * (b.fixed ? 0.15 : 0.08));
        a.position = add(a.position, push);
        if (!b.fixed) b.position = sub(b.position, push);
      }
      a.position = add(a.position, scale(sub(a.home, a.position), 0.01));
      a.position = [
        clamp(a.position[0], -limits[0], limits[0]),
        clamp(a.position[1], -limits[1], limits[1]),
        clamp(a.position[2], -limits[2], limits[2]),
      ];
    }
  }
}
