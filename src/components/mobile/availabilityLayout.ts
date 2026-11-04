import type { SceneConfig } from "@/hooks/useAvailabilityScene";

/**
 * The head (title and mode switch) and the panel (summary and cities) have a
 * fixed height, so the free area of the map never changes while the visitor
 * picks a city and the camera never jumps. Each class sits next to its number.
 * The bottom 56px of the panel clear the tab bar.
 */
export const HEAD_HEIGHT_CLASS = "h-32";
export const PANEL_HEIGHT_CLASS = "h-60";
const HEAD_HEIGHT_PX = 128;
const PANEL_HEIGHT_PX = 240;
const MAX_PANEL_SHARE = 0.5;

/** A fingertip is wider than the gap between two cities: the nearest one wins. */
export const TAP_REACH_PX = 32;

export const MOBILE_SCENE: SceneConfig = {
  reserve: (viewport) => ({
    left: 0,
    right: 0,
    top: HEAD_HEIGHT_PX,
    bottom: Math.min(PANEL_HEIGHT_PX, viewport.height * MAX_PANEL_SHARE),
  }),
  padding: { frame: 24, route: 40 },
  focus: "radius",
  routeMaxZoom: 2.2,
};
