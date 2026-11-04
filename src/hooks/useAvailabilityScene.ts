"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";
import { createScene, type Scene } from "@/lib/availability/engine/scene";
import { buildWorld, type World } from "@/lib/availability/engine/world";
import type { SceneState } from "@/lib/availability/types";

let world: World | null = null;

function sharedWorld(): World {
  world ??= buildWorld();
  return world;
}

export function useAvailabilityScene(reservedLeft: (viewportWidth: number) => number): {
  scene: Scene;
  state: SceneState;
} {
  const [scene] = useState(() => createScene({ world: sharedWorld(), reservedLeft }));
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    scene.setReducedMotion(reducedMotion === true);
  }, [scene, reducedMotion]);

  const state = useSyncExternalStore(scene.subscribe, scene.getState, scene.getState);
  return { scene, state };
}
