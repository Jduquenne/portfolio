export const OBSTACLE_ATTRIBUTE = "data-map-obstacle";

export interface Obstacle {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

const MARGIN_X = 8;
const MARGIN_Y = 6;

/** The content drawn over the map, in pixels relative to the map layer. */
export function collectObstacles(layer: DOMRect): Obstacle[] {
  return Array.from(document.querySelectorAll(`[${OBSTACLE_ATTRIBUTE}]`)).map((element) => {
    const rect = element.getBoundingClientRect();
    return {
      left: rect.left - layer.left - MARGIN_X,
      top: rect.top - layer.top - MARGIN_Y,
      right: rect.right - layer.left + MARGIN_X,
      bottom: rect.bottom - layer.top + MARGIN_Y,
    };
  });
}

export function overlapsAny(
  box: Obstacle,
  obstacles: readonly Obstacle[],
): boolean {
  return obstacles.some(
    (obstacle) =>
      box.right > obstacle.left &&
      box.left < obstacle.right &&
      box.bottom > obstacle.top &&
      box.top < obstacle.bottom,
  );
}
