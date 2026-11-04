import type { OutlineId } from "@/lib/availability/engine/world";
import type { LabelSide } from "@/lib/availability/types";

export interface CityHandles {
  group: SVGGElement | null;
  hit: SVGCircleElement | null;
  dot: SVGCircleElement | null;
  label: SVGTextElement | null;
  /** How much of the label is left once the content drawn over it is accounted for. */
  clearance: number;
  /** The side the label last settled on, tried first so it does not jump around. */
  side: LabelSide | null;
}

export interface OriginHandles {
  group: SVGGElement | null;
  dot: SVGCircleElement | null;
  ring: SVGCircleElement | null;
  label: SVGTextElement | null;
}

export interface PenHandles {
  group: SVGGElement | null;
  halo: SVGCircleElement | null;
  core: SVGCircleElement | null;
  trail: SVGLineElement | null;
}

export interface CrumpleHandles {
  group: SVGGElement | null;
  path: SVGPathElement | null;
  ball: SVGPolygonElement | null;
}

/** The SVG elements the renderer writes to. */
export interface MapHandles {
  svg: SVGSVGElement | null;
  outlines: Partial<Record<OutlineId, SVGPathElement | null>>;
  fills: { france: SVGPathElement | null; radius: SVGCircleElement | null };
  cities: Map<string, CityHandles>;
  routes: Map<string, SVGPathElement | null>;
  origin: OriginHandles;
  pen: PenHandles;
  crumples: CrumpleHandles[];
}

export function createHandles(): MapHandles {
  return {
    svg: null,
    outlines: {},
    fills: { france: null, radius: null },
    cities: new Map(),
    routes: new Map(),
    origin: { group: null, dot: null, ring: null, label: null },
    pen: { group: null, halo: null, core: null, trail: null },
    crumples: [],
  };
}

function cityEntry(handles: MapHandles, id: string): CityHandles {
  let entry = handles.cities.get(id);
  if (!entry) {
    entry = { group: null, hit: null, dot: null, label: null, clearance: 1, side: null };
    handles.cities.set(id, entry);
  }
  return entry;
}

function crumpleEntry(handles: MapHandles, slot: number): CrumpleHandles {
  while (handles.crumples.length <= slot) {
    handles.crumples.push({ group: null, path: null, ball: null });
  }
  return handles.crumples[slot];
}

/**
 * Ref callbacks for the map components. They only call these, so the handles
 * stay out of the components' hands and are filled as the elements mount.
 */
export function createRegistry(handles: MapHandles) {
  return {
    svg: (element: SVGSVGElement | null) => {
      handles.svg = element;
    },
    franceFill: (element: SVGPathElement | null) => {
      handles.fills.france = element;
    },
    radiusFill: (element: SVGCircleElement | null) => {
      handles.fills.radius = element;
    },
    outline: (id: OutlineId) => (element: SVGPathElement | null) => {
      handles.outlines[id] = element;
    },
    route: (cityId: string) => (element: SVGPathElement | null) => {
      handles.routes.set(cityId, element);
    },
    city: (id: string) => ({
      group: (element: SVGGElement | null) => {
        cityEntry(handles, id).group = element;
      },
      hit: (element: SVGCircleElement | null) => {
        cityEntry(handles, id).hit = element;
      },
      dot: (element: SVGCircleElement | null) => {
        cityEntry(handles, id).dot = element;
      },
      label: (element: SVGTextElement | null) => {
        cityEntry(handles, id).label = element;
      },
    }),
    origin: {
      group: (element: SVGGElement | null) => {
        handles.origin.group = element;
      },
      dot: (element: SVGCircleElement | null) => {
        handles.origin.dot = element;
      },
      ring: (element: SVGCircleElement | null) => {
        handles.origin.ring = element;
      },
      label: (element: SVGTextElement | null) => {
        handles.origin.label = element;
      },
    },
    pen: {
      group: (element: SVGGElement | null) => {
        handles.pen.group = element;
      },
      halo: (element: SVGCircleElement | null) => {
        handles.pen.halo = element;
      },
      core: (element: SVGCircleElement | null) => {
        handles.pen.core = element;
      },
      trail: (element: SVGLineElement | null) => {
        handles.pen.trail = element;
      },
    },
    crumple: (slot: number) => ({
      group: (element: SVGGElement | null) => {
        crumpleEntry(handles, slot).group = element;
      },
      path: (element: SVGPathElement | null) => {
        crumpleEntry(handles, slot).path = element;
      },
      ball: (element: SVGPolygonElement | null) => {
        crumpleEntry(handles, slot).ball = element;
      },
    }),
  };
}

export type MapRegistry = ReturnType<typeof createRegistry>;
