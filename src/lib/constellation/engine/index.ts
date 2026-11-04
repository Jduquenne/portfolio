import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  TRAIL_LENGTH,
  createBodies,
  createNebulae,
  createOrbitRings,
  createSky,
  createSpine,
  createTrail,
  createTreeEdges,
  sunMask,
  sunPoints,
  type Part,
  type Uniforms,
} from "@/lib/constellation/engine/parts";
import { buildNodes, placeNodes } from "@/lib/constellation/engine/nodes";
import { clamp, seededRandom } from "@/lib/constellation/math";
import type { ConstellationStore } from "@/lib/constellation/store";
import type { ConstellationModel, Layout } from "@/lib/constellation/types";

export interface EngineOptions {
  /** The stage: holds the canvas, the labels, the panel and the leader line. */
  root: HTMLElement;
  model: ConstellationModel;
  layout: Layout;
  store: ConstellationStore;
  reducedMotion: boolean;
  /** A phone: fewer stars, a lower pixel ratio, labels only for what is in focus. */
  compact: boolean;
}

export interface Engine {
  dispose: () => void;
}

const MAX_STEP_SECONDS = 0.05;
const AZIMUTH_LIMIT = 0.9;
const PICK_REACH = 0.6;

/**
 * The 3D scene: draws the constellation on the canvas of `root` and writes the
 * position of every label and of the leader line straight to the DOM, so React
 * never re-renders per frame. What the visitor chose comes from the store.
 */
export function createEngine(options: EngineOptions): Engine {
  const { root, model, layout, store, reducedMotion, compact } = options;
  const canvas = root.querySelector<HTMLCanvasElement>("[data-constellation-canvas]");
  if (!canvas) throw new Error("Constellation canvas not found");

  const labels = new Map<string, HTMLElement>();
  root.querySelectorAll<HTMLElement>("[data-node]").forEach((element) => {
    if (element.dataset.node) labels.set(element.dataset.node, element);
  });
  const leader = root.querySelector<SVGSVGElement>("[data-leader]");
  const leaderLine = leader?.querySelector("polyline") ?? null;
  const leaderDot = leader?.querySelector("circle") ?? null;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !compact,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);

  const controls = new OrbitControls(camera, canvas);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.minPolarAngle = Math.PI * 0.32;
  controls.maxPolarAngle = Math.PI * 0.68;
  controls.minAzimuthAngle = -AZIMUTH_LIMIT;
  controls.maxAzimuthAngle = AZIMUTH_LIMIT;
  controls.autoRotateSpeed = 0.4;

  const uniforms: Uniforms = {
    uActive: { value: new THREE.Vector4(1, 1, 1, 1) },
    uTime: { value: 0 },
    uDpr: { value: renderer.getPixelRatio() },
    uIntro: { value: reducedMotion ? 1 : 0 },
    uDraw: { value: reducedMotion ? 1.2 : 0 },
  };

  const nodes = buildNodes(model, layout);
  placeNodes(nodes, 0);
  const sunVectors = sunPoints(layout);
  const sunCount = sunVectors.length;
  const planetCount = model.planets.length;
  const indexOf = new Map(nodes.map((node, i) => [node.id, i]));

  const parts: Part[] = [];
  const add = <T extends Part>(part: T): T => {
    scene.add(part.object);
    parts.push(part);
    return part;
  };
  add(createSky(compact));
  add(createNebulae(uniforms, sunVectors, compact));
  const rings = add(createOrbitRings(uniforms, nodes));
  const edges = add(createTreeEdges(uniforms, nodes));
  add(createSpine(uniforms, sunVectors));
  const bodies = add(createBodies(uniforms, nodes));
  const pulse = add(createTrail(uniforms));
  const shooting = add(createTrail(uniforms));
  rings.sync();
  if (reducedMotion) {
    pulse.object.visible = false;
    shooting.object.visible = false;
  }

  const path = new THREE.CatmullRomCurve3(sunVectors, false, "catmullrom", 0.5);
  const random = seededRandom(41);

  let raf = 0;
  let visible = !document.hidden;
  let onscreen = true;

  // ── What is lit ──
  const isLit = (i: number, sun: number | null) => sun === null || nodes[i].suns.includes(sun);

  // ── Picking ──
  const ray = new THREE.Raycaster();
  ray.params.Points.threshold = PICK_REACH;
  const pointer = new THREE.Vector2();
  const pick = (event: PointerEvent | MouseEvent, accept: (i: number) => boolean): number => {
    const box = canvas.getBoundingClientRect();
    pointer.set(((event.clientX - box.left) / box.width) * 2 - 1, -((event.clientY - box.top) / box.height) * 2 + 1);
    ray.setFromCamera(pointer, camera);
    const hits = ray
      .intersectObject(bodies.points)
      .filter((hit) => hit.index !== undefined && accept(hit.index));
    hits.sort((a, b) => (a.distanceToRay ?? 0) - (b.distanceToRay ?? 0));
    return hits[0]?.index ?? -1;
  };

  let hover = -1;
  const onPlanetOrSun = (i: number) => i < sunCount + planetCount && isLit(i, store.getState().sun);

  const onMove = (event: PointerEvent) => {
    const state = store.getState();
    const next = pick(event, onPlanetOrSun);
    const selected = state.planet ? (indexOf.get(state.planet) ?? -1) : -1;
    const tool = selected >= 0 ? pick(event, (i) => nodes[i].parent === selected) : -1;
    if (next !== hover) {
      hover = next;
      invalidate();
    }
    store.hoverTool(tool >= 0 ? nodes[tool].id : null);
    canvas.style.cursor = next >= 0 || tool >= 0 ? "pointer" : "grab";
  };
  const onLeave = () => {
    hover = -1;
    store.hoverTool(null);
    invalidate();
  };
  const onClick = (event: MouseEvent) => {
    const i = pick(event, onPlanetOrSun);
    if (i < 0) store.selectPlanet(null);
    else if (nodes[i].kind === "sun") store.selectSun(nodes[i].suns[0]);
    else store.selectPlanet(nodes[i].id);
  };
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("click", onClick);

  // ── Size ──
  let fit = 24;
  let lastShift = "0,0";
  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    fit = compact ? 27 : Math.max(24, 24 * (1.75 / camera.aspect));
    camera.updateProjectionMatrix();
    lastShift = "";
    invalidate();
  };
  const sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(canvas);

  // ── Frame ──
  let previous = performance.now();
  let time = 0;
  let drawStart = 1;
  let lastSun: number | null = null;
  let shiftX = 0;
  let shiftY = 0;
  const shoot = { life: 99, next: 5, from: new THREE.Vector3(), direction: new THREE.Vector3(1, -0.45, 0).normalize() };
  const scratch = new THREE.Vector3();
  const heading = new THREE.Vector3();
  const goal = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const focus = new THREE.Vector4();

  const frame = (now: number) => {
    raf = 0;
    const dt = clamp((now - previous) / 1000, 0, MAX_STEP_SECONDS);
    previous = now;
    const state = store.getState();
    const selected = state.planet ? (indexOf.get(state.planet) ?? -1) : -1;
    const toolNode = state.tool ? (indexOf.get(state.tool) ?? -1) : -1;
    const ease = reducedMotion ? 1 : Math.min(1, dt * 3);

    if (!reducedMotion) time += dt;
    uniforms.uTime.value = time;
    if (state.sun !== lastSun) {
      lastSun = state.sun;
      drawStart = time;
    }
    if (!reducedMotion) {
      uniforms.uIntro.value = Math.min(1, time / 2);
      uniforms.uDraw.value = Math.min(1.2, Math.max(0, (time - drawStart) / 3.2) * 1.2);
    }

    // The camera flies to the open planet, the chosen sun, or back to the whole.
    direction.copy(camera.position).sub(controls.target);
    const distance = direction.length();
    direction.normalize();
    if (selected >= 0) goal.copy(nodes[selected].position);
    else if (state.sun !== null) goal.copy(sunVectors[state.sun]);
    else goal.set(0, 0, 0);
    controls.target.lerp(goal, ease);
    const wanted = selected >= 0 ? fit * 0.3 : state.sun !== null ? fit * 0.62 : fit;
    camera.position.copy(controls.target).addScaledVector(direction, distance + (wanted - distance) * ease);

    // The panel covers part of the stage: slide the scene so the open planet stays clear of it.
    const panel = selected >= 0 ? root.querySelector<HTMLElement>("[data-panel]") : null;
    let targetX = 0;
    let targetY = 0;
    if (panel) {
      const box = panel.getBoundingClientRect();
      const stage = canvas.getBoundingClientRect();
      if (compact) targetY = Math.max(0, stage.height / 2 - (72 + (box.top - stage.top)) / 2);
      else targetX = Math.max(0, stage.width / 2 - (box.left - stage.left) / 2);
    }
    shiftX += (targetX - shiftX) * ease;
    shiftY += (targetY - shiftY) * ease;
    const key = `${Math.round(shiftX)},${Math.round(shiftY)}`;
    if (key !== lastShift) {
      if (key === "0,0") camera.clearViewOffset();
      else camera.setViewOffset(canvas.clientWidth, canvas.clientHeight, shiftX, shiftY, canvas.clientWidth, canvas.clientHeight);
      lastShift = key;
    }

    controls.autoRotate = !reducedMotion && selected < 0;
    const azimuth = controls.getAzimuthalAngle();
    if (Math.abs(azimuth) > AZIMUTH_LIMIT - 0.1) {
      controls.autoRotateSpeed = -Math.sign(azimuth) * Math.abs(controls.autoRotateSpeed);
    }
    controls.update();

    // What is lit follows the chosen sun, else the body under the pointer, else the open planet.
    const lit =
      state.sun !== null ? [state.sun] : hover >= 0 ? nodes[hover].suns : selected >= 0 ? nodes[selected].suns : [0, 1, 2, 3];
    focus.set(...(sunMask(lit) as [number, number, number, number]));
    uniforms.uActive.value.lerp(focus, reducedMotion ? 1 : Math.min(1, dt * 6));

    placeNodes(nodes, time);
    bodies.sync();
    edges.sync();

    const headAt = reducedMotion ? 0 : (time * 0.06) % 1;
    if (!reducedMotion) {
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        path.getPoint((((headAt - i * 0.006) % 1) + 1) % 1, scratch);
        pulse.positions.setXYZ(i, scratch.x, scratch.y, scratch.z);
      }
      pulse.positions.needsUpdate = true;

      shoot.life += dt;
      if (shoot.life > shoot.next) {
        shoot.life = 0;
        shoot.next = 6 + random() * 6;
        shoot.from.set((random() - 0.3) * 22, 5 + random() * 6, -8 - random() * 4);
      }
      const running = shoot.life < 1.1;
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const along = running ? shoot.life * 18 - i * 0.4 : -999;
        shooting.positions.setXYZ(
          i,
          shoot.from.x + shoot.direction.x * along,
          shoot.from.y + shoot.direction.y * along,
          running ? shoot.from.z : 999,
        );
      }
      shooting.positions.needsUpdate = true;
    }
    path.getPoint(headAt, heading);

    // A body swells when the pointer is on it, a sun when the comet passes.
    const boost = bodies.boost;
    for (let i = 0; i < nodes.length; i++) {
      let target = i === hover || i === selected || i === toolNode ? 1 : 0;
      if (nodes[i].kind === "sun") target = Math.max(target, Math.max(0, 1 - heading.distanceTo(nodes[i].position) / 2.6));
      boost[i] += (target - boost[i]) * (reducedMotion ? 1 : Math.min(1, dt * 8));
    }
    bodies.boostAttribute.needsUpdate = true;

    placeLabels(selected, toolNode, state.sun);
    placeLeader(selected, panel);

    renderer.render(scene, camera);
    if (!raf && visible && onscreen && !reducedMotion) raf = requestAnimationFrame(frame);
  };

  const halfFrame = (node: (typeof nodes)[number]) =>
    ((node.size * 12) / camera.position.distanceTo(node.position)) * 0.4;

  const placeLabels = (selected: number, toolNode: number, sun: number | null) => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const intro = uniforms.uIntro.value;
    nodes.forEach((node, i) => {
      const label = labels.get(node.id);
      if (!label) return;
      scratch.copy(node.position).project(camera);
      const x = (scratch.x * 0.5 + 0.5) * width;
      const y = (-scratch.y * 0.5 + 0.5) * height;
      const half = halfFrame(node);
      label.style.transform =
        node.kind === "tool"
          ? `translate(${x + half + 8}px, ${y - 9}px)`
          : `translate(${x}px, ${y - half - (node.kind === "sun" ? 26 : 22)}px) translateX(-50%)`;
      const depth = clamp(1.15 - (scratch.z - 0.9) * 8, 0.75, 1);
      let opacity: number;
      if (node.kind === "sun") opacity = 1;
      else if (node.kind === "tool") opacity = i === toolNode ? 1 : 0;
      else if (compact && sun === null && i !== hover && i !== selected) opacity = 0;
      else opacity = isLit(i, sun) ? (i === hover || i === selected ? 1 : 0.85 * depth) : 0.25;
      label.style.opacity = String(opacity * intro);
    });
  };

  const placeLeader = (selected: number, panel: HTMLElement | null) => {
    if (!leader || !leaderLine || !leaderDot) return;
    if (selected < 0 || !panel) {
      leader.style.display = "none";
      return;
    }
    const node = nodes[selected];
    scratch.copy(node.position).project(camera);
    const stage = canvas.getBoundingClientRect();
    const x = (scratch.x * 0.5 + 0.5) * stage.width;
    const y = (-scratch.y * 0.5 + 0.5) * stage.height;
    const r = halfFrame(node) + 6;
    const box = panel.getBoundingClientRect();
    let points = "";
    if (compact) {
      if (y + r < box.top - stage.top) points = `${x},${y + r} ${x},${box.top - stage.top}`;
    } else {
      const left = box.left - stage.left;
      const knee = left - 32;
      if (x + r < knee) {
        const end = clamp(y, box.top - stage.top + 32, box.bottom - stage.top - 32);
        points = `${x + r},${y} ${knee},${y} ${left},${end}`;
      }
    }
    leaderLine.setAttribute("points", points);
    leaderDot.setAttribute("cx", String(x + r));
    leaderDot.setAttribute("cy", String(y));
    leaderDot.style.display = points && !compact ? "" : "none";
    leader.style.display = "block";
  };

  function invalidate() {
    if (!raf && visible && onscreen) raf = requestAnimationFrame(frame);
  }

  const onVisibility = () => {
    visible = !document.hidden;
    previous = performance.now();
    invalidate();
  };
  document.addEventListener("visibilitychange", onVisibility);
  const screenObserver = new IntersectionObserver(([entry]) => {
    onscreen = entry.isIntersecting;
    previous = performance.now();
    invalidate();
  });
  screenObserver.observe(canvas);
  controls.addEventListener("change", invalidate);
  const unsubscribe = store.subscribe(invalidate);
  resize();
  camera.position.set(0, 0, fit);
  invalidate();

  return {
    dispose: () => {
      cancelAnimationFrame(raf);
      raf = 0;
      visible = false;
      unsubscribe();
      controls.removeEventListener("change", invalidate);
      controls.dispose();
      sizeObserver.disconnect();
      screenObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("click", onClick);
      parts.forEach((part) => part.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
