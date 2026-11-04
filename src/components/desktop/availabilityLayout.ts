import type { SceneConfig } from "@/hooks/useAvailabilityScene";

/**
 * Where the availability card sits over the map. The map keeps this much of its
 * width free on the left so the card never covers the place it points at.
 * The narrow case starts when the Hero is under 900px wide, that is a window
 * under 1188px (the 288px sidebar included).
 */
const NARROW_VIEWPORT_PX = 900;

export const CARD_WIDTH_CLASSES = "w-76 min-[1188px]:w-88";

function reservedLeft(viewportWidth: number): number {
  return viewportWidth < NARROW_VIEWPORT_PX
    ? Math.min(viewportWidth * 0.55, 384)
    : Math.min(viewportWidth * 0.5, 448);
}

export const DESKTOP_SCENE: SceneConfig = {
  reserve: (viewport) => ({
    left: reservedLeft(viewport.width),
    top: 0,
    right: 0,
    bottom: 0,
  }),
  padding: { frame: 56, route: 88 },
};
