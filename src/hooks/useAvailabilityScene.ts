"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";
import { createScene, type Scene, type SceneOptions } from "@/lib/availability/engine/scene";
import { buildWorld, type World } from "@/lib/availability/engine/world";
import type { SceneState } from "@/lib/availability/types";

/** What a layout decides about the scene: where the map may sit, and how it is framed. */
export type SceneConfig = Omit<SceneOptions, "world">;

let world: World | null = null;

function sharedWorld(): World {
  world ??= buildWorld();
  return world;
}

export function useAvailabilityScene(config: SceneConfig): {
  scene: Scene;
  state: SceneState;
} {
  const [scene] = useState(() => createScene({ world: sharedWorld(), ...config }));
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    scene.setReducedMotion(reducedMotion === true);
  }, [scene, reducedMotion]);

  const state = useSyncExternalStore(scene.subscribe, scene.getState, scene.getState);
  return { scene, state };
}
