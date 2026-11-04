import type { ConstellationState } from "@/lib/constellation/types";

export interface ConstellationStore {
  getState: () => ConstellationState;
  subscribe: (listener: () => void) => () => void;
  /** Focuses a sun (or null for the whole constellation); closes the open planet. */
  selectSun: (sun: number | null) => void;
  selectPlanet: (planet: string | null) => void;
  hoverTool: (tool: string | null) => void;
}

const INITIAL: ConstellationState = { sun: null, planet: null, tool: null };

/**
 * What the visitor has chosen, shared by the interface and the 3D scene. It has
 * no dependency on the scene, so the interface works before the scene is loaded.
 */
export function createConstellationStore(): ConstellationStore {
  let state = INITIAL;
  const listeners = new Set<() => void>();

  const set = (next: Partial<ConstellationState>) => {
    const merged = { ...state, ...next };
    if (
      merged.sun === state.sun &&
      merged.planet === state.planet &&
      merged.tool === state.tool
    ) {
      return;
    }
    state = merged;
    listeners.forEach((listener) => listener());
  };

  return {
    getState: () => state,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    selectSun: (sun) => set({ sun, planet: null, tool: null }),
    selectPlanet: (planet) => set({ planet, tool: null }),
    hoverTool: (tool) => set({ tool }),
  };
}
