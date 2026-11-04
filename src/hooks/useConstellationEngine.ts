"use client";

import { useEffect, useState, type RefObject } from "react";
import type { ConstellationStore } from "@/lib/constellation/store";
import type { ConstellationModel, Layout } from "@/lib/constellation/types";

export type EngineStatus = "waiting" | "ready" | "failed";

interface UseConstellationEngineOptions {
  /** The stage that holds the canvas, the labels and the panel. */
  rootRef: RefObject<HTMLElement | null>;
  model: ConstellationModel;
  layout: Layout;
  store: ConstellationStore;
  compact: boolean;
  reducedMotion: boolean;
  /** The 3D library is only requested once this is true. */
  enabled: boolean;
}

/**
 * Loads the scene on demand and starts it on the stage. The interface does not
 * depend on it: until it is ready (or if it fails) the visitor uses the list.
 */
export function useConstellationEngine({
  rootRef,
  model,
  layout,
  store,
  compact,
  reducedMotion,
  enabled,
}: UseConstellationEngineOptions): EngineStatus {
  const [status, setStatus] = useState<EngineStatus>("waiting");

  useEffect(() => {
    const root = rootRef.current;
    if (!enabled || !root) return;

    let cancelled = false;
    let dispose: (() => void) | null = null;

    import("@/lib/constellation/engine")
      .then(({ createEngine }) => {
        if (cancelled) return;
        dispose = createEngine({ root, model, layout, store, compact, reducedMotion }).dispose;
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("failed");
      });

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [rootRef, enabled, model, layout, store, compact, reducedMotion]);

  return status;
}
