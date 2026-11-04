import { MOTION } from "@/lib/availability/data/config";
import {
  frameFor,
  scaleOf,
  screenToWorld,
  viewBoxOf,
} from "@/lib/availability/geo/camera";
import { clamp, easeOut, type Easing } from "@/lib/availability/geo/math";
import { boundsOf, drawnPoints } from "@/lib/availability/geo/shape";
import {
  createCrumple,
  crumpleFrame,
  isCrumpleDone,
  type Crumple,
  type CrumpleFrame,
} from "@/lib/availability/engine/crumple";
import {
  advanceProgram,
  completeProgram,
  createProgram,
  moveEnd,
  moveStart,
  type Program,
} from "@/lib/availability/engine/toolpath";
import { Tweens } from "@/lib/availability/engine/tweens";
import {
  appearsIn,
  type OutlineId,
  type World,
  type WorldCity,
} from "@/lib/availability/engine/world";
import type {
  Camera,
  MapMode,
  Point,
  SceneState,
  Viewport,
} from "@/lib/availability/types";

type CameraKey = "remote" | "onsite" | "route";
type Stage = "pending" | "running" | "done";

const FRAME_PADDING = 56;
const ROUTE_FRAME_PADDING = 88;
const ROUTE_MAX_ZOOM = 3.4;
const POP_SECONDS = 0.25;
const SETTLE_SECONDS = 0.3;
const MAX_CRUMPLES = 3;
const OUTLINE_OPACITY = { national: 0.42, region: 0.9, radius: 0.95 } as const;
const DIMMED = 0.6;

export interface SceneOptions {
  world: World;
  /** Width in pixels the map leaves free on the left, for the content over it. */
  reservedLeft: (viewportWidth: number) => number;
}

export interface FrameContext {
  /** Where paper balls fly to, in viewport pixels. */
  crumpleTarget: Point | null;
}

export interface OutlineFrame {
  progress: number;
  opacity: number;
}

export interface CityFrame {
  id: string;
  visible: boolean;
  popScale: number;
  dotOpacity: number;
  labelOpacity: number;
  interactive: boolean;
  selected: boolean;
}

export interface SceneFrame {
  camera: Camera;
  scale: number;
  viewBox: string;
  outlines: Record<OutlineId, OutlineFrame>;
  fills: { france: number; radius: number };
  cities: CityFrame[];
  origin: { visible: boolean; popScale: number; opacity: number };
  route: { cityId: string; progress: number } | null;
  head: { position: Point; opacity: number };
  trail: { from: Point; to: Point; opacity: number };
  crumples: CrumpleFrame[];
}

export interface Scene {
  readonly world: World;
  getState: () => SceneState;
  subscribe: (listener: () => void) => () => void;
  onWake: (listener: () => void) => () => void;
  setViewport: (viewport: Viewport) => void;
  setReducedMotion: (reduced: boolean) => void;
  start: (options: { animate: boolean }) => void;
  setMode: (mode: MapMode) => void;
  toggleCity: (cityId: string) => void;
  clearSelection: () => void;
  isActive: () => boolean;
  advance: (dt: number, context: FrameContext) => SceneFrame;
}

export function createScene({ world, reservedLeft }: SceneOptions): Scene {
  const tweens = new Tweens();
  const listeners = new Set<() => void>();
  const wakeListeners = new Set<() => void>();

  let state: SceneState = { phase: "idle", mode: "onsite", selectedCityId: null };
  let viewport: Viewport = { width: 1, height: 1 };
  let reducedMotion = false;
  let clock = 0;

  const camera: Camera = { cx: 0, cy: 0, logScale: 0 };
  let cameraKey: CameraKey = "onsite";
  const frames: Record<CameraKey, Camera> = {
    remote: { ...camera },
    onsite: { ...camera },
    route: { ...camera },
  };

  const fx = { head: 0, trail: 0, region: 1, national: 0, franceFill: 0, radiusFill: 0 };
  const progress: Record<string, number> = { france: 0, corsica: 0, region: 0, radius: 0, route: 0 };
  const popAt = new Map<string, number>();
  const stage: Record<"national" | "regional", Stage> = { national: "pending", regional: "pending" };
  let national: Program | null = null;
  let regional: Program | null = null;
  let routeProgram: Program | null = null;
  let head: Point = world.origin.position;
  let trail = { from: head, to: head };
  let trailOn = false;
  let crumples: Crumple[] = [];

  const cityById = new Map(world.cities.map((city) => [city.id, city]));
  const selectedCity = (): WorldCity | null =>
    state.selectedCityId ? (cityById.get(state.selectedCityId) ?? null) : null;

  const wake = () => wakeListeners.forEach((listener) => listener());

  function setState(next: Partial<SceneState>) {
    const merged = { ...state, ...next };
    if (
      merged.phase === state.phase &&
      merged.mode === state.mode &&
      merged.selectedCityId === state.selectedCityId
    ) {
      return;
    }
    state = merged;
    listeners.forEach((listener) => listener());
  }

  function tweenTo<K extends string>(
    target: { [P in K]: number },
    key: K,
    value: number,
    seconds: number,
    ease?: Easing,
  ) {
    tweens.to(target, key, value, reducedMotion ? 0 : seconds, ease);
    wake();
  }

  function computeFrames() {
    const left = reservedLeft(viewport.width);
    frames.remote = frameFor(world.bounds.france, viewport, {
      padding: FRAME_PADDING,
      reservedLeft: left,
    });
    frames.onsite = frameFor(world.bounds.region, viewport, {
      padding: FRAME_PADDING,
      reservedLeft: left,
    });
    const route = selectedCity()?.route;
    if (route) {
      frames.route = frameFor(
        boundsOf([...route.shape.points, world.origin.position]),
        viewport,
        {
          padding: ROUTE_FRAME_PADDING,
          reservedLeft: left,
          minLogScale: frames.onsite.logScale,
          maxLogScale: frames.onsite.logScale + Math.log(ROUTE_MAX_ZOOM),
        },
      );
    }
  }

  function goCamera(key: CameraKey, seconds: number) {
    cameraKey = key;
    tweenTo(camera, "cx", frames[key].cx, seconds);
    tweenTo(camera, "cy", frames[key].cy, seconds);
    tweenTo(camera, "logScale", frames[key].logScale, seconds);
  }

  function snapCamera(key: CameraKey) {
    cameraKey = key;
    tweens.cancel(camera);
    Object.assign(camera, frames[key]);
  }

  const speedsFor = (key: CameraKey) => {
    const scale = scaleOf(frames[key]);
    return { print: MOTION.printSpeedPx / scale, rapid: MOTION.rapidSpeedPx / scale };
  };

  const sink = (shapeId: string, value: number) => {
    progress[shapeId] = value;
  };

  function settle() {
    if (national?.done) {
      stage.national = "done";
      national = null;
    }
    if (regional?.done) {
      stage.regional = "done";
      regional = null;
    }
    if (routeProgram?.done) routeProgram = null;
  }

  function finish(program: Program | null) {
    if (program) completeProgram(program, sink);
    settle();
  }

  function popCities(step: number, include: (city: WorldCity) => boolean) {
    let order = 0;
    for (const city of world.cities) {
      if (!include(city)) continue;
      popAt.set(city.id, clock + order * step);
      order += 1;
    }
  }

  function runNational(delay: number) {
    const { france, corsica } = world.outlines;
    const program = createProgram(
      [
        { kind: "print", shapeId: "france", shape: france },
        { kind: "rapid", to: corsica.points[0] },
        { kind: "print", shapeId: "corsica", shape: corsica },
        { kind: "dwell", duration: 0.35 },
      ],
      france.points[0],
      speedsFor("remote"),
      delay,
    );
    program.events.push(
      {
        at: moveStart(program, 3),
        run: () => {
          popCities(0.05, (city) => city.scope !== "regional");
          tweenTo(fx, "franceFill", 0.05, 0.5);
          tweenTo(fx, "head", 0, 0.3);
        },
      },
      {
        at: program.total,
        run: () => {
          if (state.mode === "onsite" && stage.regional === "pending") zoomToRegion();
        },
      },
    );
    stage.national = "running";
    national = program;
  }

  function runRegional(delay: number) {
    const { region, radius } = world.outlines;
    const program = createProgram(
      [
        { kind: "print", shapeId: "region", shape: region },
        { kind: "rapid", to: radius.points[0] },
        { kind: "print", shapeId: "radius", shape: radius },
      ],
      region.points[0],
      speedsFor("onsite"),
      delay,
    );
    program.events.push(
      { at: moveEnd(program, 1), run: () => popAt.set(world.origin.id, clock) },
      {
        at: program.total,
        run: () => {
          popCities(0.04, (city) => city.scope !== "national");
          tweenTo(fx, "radiusFill", 0.04, 0.5);
          tweenTo(fx, "head", 0, 0.3);
        },
      },
    );
    stage.regional = "running";
    regional = program;
  }

  function zoomToRegion() {
    tweenTo(fx, "national", 0, 0.3);
    tweenTo(fx, "franceFill", 0.02, 0.4);
    goCamera("onsite", 0.8);
    runRegional(0.45);
  }

  function resetDrawing() {
    for (const key of Object.keys(progress)) progress[key] = 0;
    popAt.clear();
    tweens.cancel(fx);
    Object.assign(fx, { head: 0, trail: 0, region: 1, national: 1, franceFill: 0, radiusFill: 0 });
    stage.national = "pending";
    stage.regional = "pending";
    national = regional = routeProgram = null;
    trailOn = false;
  }

  function showInstant() {
    resetDrawing();
    for (const id of ["france", "corsica", "region", "radius"]) progress[id] = 1;
    for (const city of world.cities) popAt.set(city.id, -1);
    popAt.set(world.origin.id, -1);
    Object.assign(fx, { national: 0, franceFill: 0.02, radiusFill: 0.04 });
    stage.national = "done";
    stage.regional = "done";
    snapCamera("onsite");
    setState({ phase: "ready", mode: "onsite" });
    wake();
  }

  function beginOpening() {
    resetDrawing();
    snapCamera("remote");
    setState({ phase: "drawing", mode: "onsite" });
    runNational(0.1);
    wake();
  }

  function startSelection(city: WorldCity) {
    const route = city.route;
    if (!route) return;
    setState({ selectedCityId: city.id });
    computeFrames();
    goCamera("route", 0.7);
    progress.route = 0;
    if (reducedMotion) {
      progress.route = 1;
      return;
    }
    const program = createProgram(
      [{ kind: "print", shapeId: "route", shape: route.shape, minDuration: 0.6 }],
      world.origin.position,
      speedsFor("route"),
      0.25,
    );
    program.events.push({ at: program.total, run: () => tweenTo(fx, "head", 0, 0.3) });
    routeProgram = program;
    wake();
  }

  function dropSelection(keepCamera: boolean) {
    const city = selectedCity();
    if (!city?.route) return;
    const drawn = drawnPoints(city.route.shape, progress.route);
    if (!reducedMotion && drawn.length > 1) {
      crumples = [
        ...crumples.slice(-(MAX_CRUMPLES - 1)),
        createCrumple(drawn, MOTION.crumpleSeconds, MOTION.flySeconds),
      ];
    }
    progress.route = 0;
    routeProgram = null;
    setState({ selectedCityId: null });
    computeFrames();
    if (!keepCamera && state.mode === "onsite") goCamera("onsite", 0.7);
    tweenTo(fx, "head", 0, 0.2);
    wake();
  }

  function cityFrame(city: WorldCity): CityFrame {
    const group = Math.max(
      appearsIn(city.scope, "remote") ? fx.national : 0,
      appearsIn(city.scope, "onsite") ? fx.region : 0,
    );
    const popped = clamp((clock - (popAt.get(city.id) ?? Infinity)) / POP_SECONDS);
    const selected = city.id === state.selectedCityId;
    const hasRoute = selectedCity() !== null;
    const inRange = city.route !== null;
    const strong = city.scope !== "regional" || inRange;
    const labelWeight = selected
      ? 1
      : hasRoute
        ? inRange
          ? DIMMED
          : 0
        : strong
          ? 0.85
          : 0.55;
    return {
      id: city.id,
      visible: group * popped > 0.01,
      popScale: easeOut(popped),
      dotOpacity: group * popped * (hasRoute && !selected ? 0.5 : 1) * (strong ? 1 : 0.45),
      labelOpacity: group * popped * labelWeight,
      interactive:
        inRange &&
        state.mode === "onsite" &&
        state.phase === "ready" &&
        group > 0.9 &&
        popped >= 1,
      selected,
    };
  }

  function outlineFrame(id: OutlineId): OutlineFrame {
    const dimmed = selectedCity() ? DIMMED : 1;
    const region = fx.region;
    const base =
      id === "region"
        ? OUTLINE_OPACITY.region * region
        : id === "radius"
          ? OUTLINE_OPACITY.radius * region
          : OUTLINE_OPACITY.national;
    return { progress: progress[id], opacity: base * dimmed };
  }

  function updateTrail() {
    const travelling = [national, regional, routeProgram].find((program) => program?.rapid);
    if (travelling?.rapid) {
      trail = { from: travelling.rapid.from, to: travelling.rapid.to };
      trailOn = true;
      tweens.cancel(fx, "trail");
      fx.trail = 0.4;
    } else if (trailOn) {
      trailOn = false;
      tweenTo(fx, "trail", 0, 0.35, easeOut);
    }
  }

  function stepPrograms(dt: number) {
    for (const program of [national, regional, routeProgram]) {
      if (!program) continue;
      advanceProgram(program, dt, sink);
      head = program.head;
      if (program.elapsed >= 0) fx.head = 1;
    }
    settle();
    updateTrail();
  }

  function syncPhase() {
    if (state.phase === "idle") return;
    setState({ phase: national || regional ? "drawing" : "ready" });
  }

  function popsSettling() {
    for (const time of popAt.values()) {
      if (Number.isFinite(time) && clock - time < POP_SECONDS + SETTLE_SECONDS) return true;
    }
    return false;
  }

  return {
    world,
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    onWake(listener) {
      wakeListeners.add(listener);
      return () => wakeListeners.delete(listener);
    },
    setViewport(next) {
      viewport = next;
      computeFrames();
      snapCamera(cameraKey === "route" && !selectedCity() ? "onsite" : cameraKey);
      wake();
    },
    setReducedMotion(reduced) {
      reducedMotion = reduced;
    },
    start({ animate }) {
      if (state.phase !== "idle") return;
      if (!animate || reducedMotion) showInstant();
      else beginOpening();
    },
    setMode(mode) {
      if (state.phase === "idle" || mode === state.mode) return;
      if (mode === "remote") dropSelection(true);
      setState({ mode });
      if (mode === "remote") {
        finish(regional);
        goCamera("remote", 0.8);
        tweenTo(fx, "region", 0, 0.3);
        tweenTo(fx, "national", 1, 0.5);
        if (stage.national === "done") tweenTo(fx, "franceFill", 0.05, 0.4);
      } else {
        goCamera("onsite", 0.8);
        tweenTo(fx, "national", 0, 0.3);
        tweenTo(fx, "region", 1, 0.4);
        finish(national);
        if (stage.national === "done") tweenTo(fx, "franceFill", 0.02, 0.4);
        if (stage.regional === "pending") runRegional(0.45);
      }
      wake();
    },
    toggleCity(cityId) {
      const city = cityById.get(cityId);
      if (!city?.route || state.mode !== "onsite" || state.phase !== "ready") return;
      if (state.selectedCityId === cityId) {
        dropSelection(false);
        return;
      }
      if (state.selectedCityId) dropSelection(true);
      startSelection(city);
    },
    clearSelection() {
      dropSelection(false);
    },
    isActive: () =>
      tweens.active ||
      national !== null ||
      regional !== null ||
      routeProgram !== null ||
      crumples.length > 0 ||
      popsSettling(),
    advance(dt, context) {
      clock += dt;
      tweens.update(dt);
      stepPrograms(dt);
      for (const crumple of crumples) crumple.elapsed += dt;
      crumples = crumples.filter((crumple) => !isCrumpleDone(crumple));
      syncPhase();

      const scale = scaleOf(camera);
      const target = context.crumpleTarget
        ? screenToWorld(camera, viewport, context.crumpleTarget)
        : null;
      const originPop = clamp((clock - (popAt.get(world.origin.id) ?? Infinity)) / POP_SECONDS);
      const selected = selectedCity();

      return {
        camera: { ...camera },
        scale,
        viewBox: viewBoxOf(camera, viewport),
        outlines: {
          france: outlineFrame("france"),
          corsica: outlineFrame("corsica"),
          region: outlineFrame("region"),
          radius: outlineFrame("radius"),
        },
        fills: {
          france: fx.franceFill * (progress.france >= 1 ? 1 : 0),
          radius: fx.radiusFill * fx.region * (selected ? DIMMED : 1),
        },
        cities: world.cities.map(cityFrame),
        origin: {
          visible: fx.region * originPop > 0.01,
          popScale: easeOut(originPop),
          opacity: fx.region * originPop,
        },
        route: selected ? { cityId: selected.id, progress: progress.route } : null,
        head: { position: head, opacity: fx.head },
        trail: { ...trail, opacity: fx.trail * 0.6 },
        crumples: crumples.map((crumple) =>
          crumpleFrame(crumple, scale, target ?? crumple.center),
        ),
      };
    },
  };
}
