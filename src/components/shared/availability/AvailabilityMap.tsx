"use client";

import { useCallback, useRef, useState, type RefObject } from "react";
import { CityTooltip, type TooltipTarget } from "@/components/shared/availability/CityTooltip";
import { MapCities, type HoverPoint } from "@/components/shared/availability/MapCities";
import { MapCrumples } from "@/components/shared/availability/MapCrumples";
import { MapOrigin } from "@/components/shared/availability/MapOrigin";
import { MapOutlines } from "@/components/shared/availability/MapOutlines";
import { MapPen } from "@/components/shared/availability/MapPen";
import { MapRoutes } from "@/components/shared/availability/MapRoutes";
import { useSceneLoop } from "@/hooks/useSceneLoop";
import type { Scene } from "@/lib/availability/engine/scene";
import { createHandles, createRegistry } from "@/lib/availability/render/handles";

const CRUMPLE_SLOTS = 3;

interface AvailabilityMapProps {
  scene: Scene;
  /** The element the paper balls fly into when a route is cleared. */
  crumpleTargetRef: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * The map as a decorative SVG layer. The scene draws it frame by frame, and the
 * visitor reaches the same cities from the list next to it, so it is hidden
 * from assistive technology.
 */
export function AvailabilityMap({
  scene,
  crumpleTargetRef,
  className,
}: AvailabilityMapProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const [handles] = useState(createHandles);
  const [registry] = useState(() => createRegistry(handles));
  const { svg } = registry;
  const [tooltip, setTooltip] = useState<TooltipTarget | null>(null);

  useSceneLoop(scene, handles, layerRef, crumpleTargetRef);

  const hover = useCallback((cityId: string | null, point?: HoverPoint) => {
    setTooltip(cityId && point ? { cityId, ...point } : null);
  }, []);

  return (
    <>
      <div ref={layerRef} aria-hidden="true" className={className}>
        <svg ref={svg} focusable="false" className="size-full">
          <MapOutlines world={scene.world} registry={registry} />
          <MapRoutes world={scene.world} registry={registry} />
          <MapCities
            world={scene.world}
            registry={registry}
            onSelect={scene.toggleCity}
            onHover={hover}
          />
          <MapOrigin registry={registry} />
          <MapPen registry={registry} />
          <MapCrumples registry={registry} slots={CRUMPLE_SLOTS} />
        </svg>
      </div>
      <CityTooltip world={scene.world} target={tooltip} />
    </>
  );
}
