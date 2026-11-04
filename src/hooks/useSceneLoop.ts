"use client";

import { useEffect, type RefObject } from "react";
import type { Scene } from "@/lib/availability/engine/scene";
import { applyFrame } from "@/lib/availability/render/applyFrame";
import type { MapHandles } from "@/lib/availability/render/handles";
import { collectObstacles } from "@/lib/availability/render/obstacles";
import type { Point } from "@/lib/availability/types";

const MAX_STEP_SECONDS = 0.05;

function centerOf(element: Element | null, layer: DOMRect): Point | null {
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return [rect.left + rect.width / 2 - layer.left, rect.top + rect.height / 2 - layer.top];
}

/**
 * Runs the scene on animation frames, but only while it has something to
 * animate. The frame goes straight to the SVG, never through React state.
 */
export function useSceneLoop(
  scene: Scene,
  handles: MapHandles,
  layerRef: RefObject<HTMLElement | null>,
  crumpleTargetRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    let raf = 0;
    let last = 0;
    const size = () => ({ width: layer.clientWidth, height: layer.clientHeight });

    const step = (now: number) => {
      const dt = Math.min(MAX_STEP_SECONDS, (now - last) / 1000);
      last = now;
      const rect = layer.getBoundingClientRect();
      const frame = scene.advance(dt, {
        crumpleTarget: centerOf(crumpleTargetRef.current, rect),
      });
      applyFrame(frame, scene.world, handles, size(), collectObstacles(rect));
      raf = scene.isActive() ? requestAnimationFrame(step) : 0;
    };

    const wake = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };

    const stopWake = scene.onWake(wake);
    const observer = new ResizeObserver(() => scene.setViewport(size()));
    observer.observe(layer);
    scene.setViewport(size());

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      stopWake();
      observer.disconnect();
    };
  }, [scene, handles, layerRef, crumpleTargetRef]);
}
