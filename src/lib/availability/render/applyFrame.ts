import { worldToScreen } from "@/lib/availability/geo/camera";
import { lerp } from "@/lib/availability/geo/math";
import type { SceneFrame } from "@/lib/availability/engine/scene";
import type { OutlineId, World } from "@/lib/availability/engine/world";
import type { MapHandles } from "@/lib/availability/render/handles";
import { overlapsAny, type Obstacle } from "@/lib/availability/render/obstacles";
import type { LabelSide, Viewport } from "@/lib/availability/types";

const STROKE = { france: 1.25, corsica: 1.25, region: 1.5, radius: 1.5, route: 2.25 } as const;
const OUTLINES: readonly OutlineId[] = ["france", "corsica", "region", "radius"];
const DOT_RADIUS = { selected: 5.5, origin: 4.5, strong: 3, weak: 2.2 } as const;
const HIT_RADIUS_PX = 14;
const LABEL_OFFSET_PX = 8;
const LABEL_FONT_PX = 11;
const LABEL_CHAR_PX = 6.8;
const LABEL_CLEARANCE_EASING = 0.3;

const set = (element: Element | null, name: string, value: string | number) =>
  element?.setAttribute(name, String(value));

const SIDES: readonly LabelSide[] = ["e", "w", "n", "s"];
const DOT_CLEARANCE_PX = 5;
const LABEL_GAP_PX = 2;

function labelBox(
  [x, y]: readonly [number, number],
  side: LabelSide,
  characters: number,
): Obstacle {
  const width = characters * LABEL_CHAR_PX + 4;
  const left = side === "e" ? x + 6 : side === "w" ? x - LABEL_OFFSET_PX - width : x - width / 2;
  const right = side === "e" ? x + LABEL_OFFSET_PX + width : side === "w" ? x - 6 : x + width / 2;
  const top = side === "n" ? y - 22 : side === "s" ? y + 6 : y - 8;
  const bottom = side === "n" ? y - 6 : side === "s" ? y + 22 : y + 8;
  return {
    left: left - LABEL_GAP_PX,
    right: right + LABEL_GAP_PX,
    top: top - LABEL_GAP_PX,
    bottom: bottom + LABEL_GAP_PX,
  };
}

function placeLabel(
  label: SVGTextElement,
  [x, y]: readonly [number, number],
  side: LabelSide,
  scale: number,
) {
  const offset = LABEL_OFFSET_PX / scale;
  set(label, "text-anchor", side === "w" ? "end" : side === "e" ? "start" : "middle");
  set(label, "x", x + (side === "e" ? offset : side === "w" ? -offset : 0));
  set(
    label,
    "y",
    y + (side === "n" ? -offset - 2 / scale : side === "s" ? offset + 10 / scale : 4 / scale),
  );
  set(label, "font-size", LABEL_FONT_PX / scale);
}

const orders = new WeakMap<World, number[]>();

/** Cities with a route first, nearest first: they are the ones worth a readable name. */
function priorityOrder(world: World): number[] {
  let order = orders.get(world);
  if (!order) {
    order = world.cities
      .map((city, index) => index)
      .sort((a, b) => {
        const ra = world.cities[a].route?.durationMin ?? Infinity;
        const rb = world.cities[b].route?.durationMin ?? Infinity;
        return ra - rb;
      });
    orders.set(world, order);
  }
  return order;
}

/** Writes one scene frame to the SVG. No React render happens per frame. */
export function applyFrame(
  frame: SceneFrame,
  world: World,
  handles: MapHandles,
  viewport: Viewport,
  obstacles: readonly Obstacle[],
): void {
  const { scale } = frame;
  set(handles.svg, "viewBox", frame.viewBox);

  for (const id of OUTLINES) {
    const element = handles.outlines[id];
    const outline = frame.outlines[id];
    if (!element) continue;
    element.style.visibility = outline.progress > 0 && outline.opacity > 0.01 ? "visible" : "hidden";
    set(element, "stroke-dashoffset", 1 - outline.progress);
    set(element, "stroke-width", STROKE[id] / scale);
    set(element, "stroke-opacity", outline.opacity);
  }
  set(handles.fills.france, "fill-opacity", frame.fills.france);
  set(handles.fills.radius, "fill-opacity", frame.fills.radius);

  for (const [cityId, element] of handles.routes) {
    if (!element) continue;
    const active = frame.route?.cityId === cityId;
    element.style.visibility = active && frame.route && frame.route.progress > 0 ? "visible" : "hidden";
    if (active && frame.route) {
      set(element, "stroke-dashoffset", 1 - frame.route.progress);
      set(element, "stroke-width", STROKE.route / scale);
    }
  }

  const screenOf = (position: readonly [number, number]) =>
    worldToScreen(frame.camera, viewport, position);
  const placed: Obstacle[] = [];

  const originEntry = handles.origin;
  if (originEntry.label && frame.origin.visible) {
    placed.push(labelBox(screenOf(world.origin.position), "n", originEntry.label.textContent?.length ?? 0));
  }

  const dotBoxes = new Map<number, Obstacle>();
  world.cities.forEach((city, index) => {
    if (!frame.cities[index].visible) return;
    const [sx, sy] = screenOf(city.position);
    dotBoxes.set(index, {
      left: sx - DOT_CLEARANCE_PX,
      right: sx + DOT_CLEARANCE_PX,
      top: sy - DOT_CLEARANCE_PX,
      bottom: sy + DOT_CLEARANCE_PX,
    });
  });

  for (const index of priorityOrder(world)) {
    const city = world.cities[index];
    const state = frame.cities[index];
    const entry = handles.cities.get(city.id);
    if (!entry?.group || !entry.dot || !entry.label || !entry.hit) continue;
    entry.group.style.display = state.visible ? "" : "none";
    entry.group.style.pointerEvents = state.interactive ? "auto" : "none";
    entry.group.style.cursor = state.interactive ? "pointer" : "";
    if (!state.visible) continue;

    const [x, y] = city.position;
    const radius = state.selected
      ? DOT_RADIUS.selected
      : city.route || city.scope !== "regional"
        ? DOT_RADIUS.strong
        : DOT_RADIUS.weak;
    set(entry.dot, "cx", x);
    set(entry.dot, "cy", y);
    set(entry.dot, "r", (radius / scale) * state.popScale);
    set(entry.dot, "fill-opacity", state.dotOpacity);
    set(entry.hit, "cx", x);
    set(entry.hit, "cy", y);
    set(entry.hit, "r", state.interactive ? HIT_RADIUS_PX / scale : 0);

    const screen = screenOf(city.position);
    const length = entry.label.textContent?.length ?? 0;
    const others = [...dotBoxes.entries()].filter(([other]) => other !== index).map(([, box]) => box);
    const candidates = [...new Set<LabelSide>([entry.side ?? city.labelSide, city.labelSide, ...SIDES])];
    let chosen: LabelSide | null = null;
    let box: Obstacle | null = null;
    for (const side of candidates) {
      const attempt = labelBox(screen, side, length);
      if (!overlapsAny(attempt, obstacles) && !overlapsAny(attempt, placed) && !overlapsAny(attempt, others)) {
        chosen = side;
        box = attempt;
        break;
      }
    }
    if (chosen && box) {
      entry.side = chosen;
      if (state.labelOpacity > 0.05) placed.push(box);
      placeLabel(entry.label, city.position, chosen, scale);
    }
    entry.clearance = lerp(entry.clearance, chosen ? 1 : 0, LABEL_CLEARANCE_EASING);
    const opacity = state.labelOpacity * entry.clearance;
    entry.label.style.display = opacity > 0.01 ? "" : "none";
    set(entry.label, "fill-opacity", opacity);
  }

  const origin = handles.origin;
  if (origin.group && origin.dot && origin.ring && origin.label) {
    origin.group.style.display = frame.origin.visible ? "" : "none";
    if (frame.origin.visible) {
      const [x, y] = world.origin.position;
      set(origin.dot, "cx", x);
      set(origin.dot, "cy", y);
      set(origin.dot, "r", (DOT_RADIUS.origin / scale) * frame.origin.popScale);
      set(origin.dot, "fill-opacity", frame.origin.opacity);
      set(origin.ring, "cx", x);
      set(origin.ring, "cy", y);
      set(origin.ring, "r", (9 / scale) * frame.origin.popScale);
      set(origin.ring, "stroke-width", 1 / scale);
      set(origin.ring, "stroke-opacity", frame.origin.opacity * 0.8);
      placeLabel(origin.label, world.origin.position, "n", scale);
      set(origin.label, "fill-opacity", frame.origin.opacity);
    }
  }

  const { pen } = handles;
  if (pen.group) {
    pen.group.style.display = frame.head.opacity > 0.01 ? "" : "none";
    set(pen.group, "opacity", frame.head.opacity);
    set(pen.halo, "cx", frame.head.position[0]);
    set(pen.halo, "cy", frame.head.position[1]);
    set(pen.halo, "r", 9 / scale);
    set(pen.core, "cx", frame.head.position[0]);
    set(pen.core, "cy", frame.head.position[1]);
    set(pen.core, "r", 3.2 / scale);
  }
  if (pen.trail) {
    set(pen.trail, "x1", frame.trail.from[0]);
    set(pen.trail, "y1", frame.trail.from[1]);
    set(pen.trail, "x2", frame.trail.to[0]);
    set(pen.trail, "y2", frame.trail.to[1]);
    set(pen.trail, "stroke-width", 1 / scale);
    set(pen.trail, "stroke-opacity", frame.trail.opacity);
  }

  handles.crumples.forEach((slot, index) => {
    const crumple = frame.crumples[index];
    if (!slot.group || !slot.path || !slot.ball) return;
    slot.group.style.display = crumple ? "" : "none";
    if (!crumple) return;
    set(slot.path, "d", `M${crumple.path.map(([px, py]) => `${px.toFixed(2)},${py.toFixed(2)}`).join("L")}`);
    set(slot.path, "stroke-width", STROKE.route / scale);
    set(slot.ball, "points", crumple.ball.map(([px, py]) => `${px.toFixed(2)},${py.toFixed(2)}`).join(" "));
    set(slot.ball, "fill-opacity", crumple.ballOpacity);
    set(slot.ball, "stroke-opacity", crumple.ballOpacity);
    set(slot.ball, "stroke-width", 1.2 / scale);
    set(
      slot.group,
      "transform",
      `translate(${crumple.position[0]} ${crumple.position[1]}) rotate(${crumple.rotation}) scale(${crumple.scale}) translate(${-crumple.center[0]} ${-crumple.center[1]})`,
    );
    set(slot.group, "opacity", crumple.opacity);
  });
}
