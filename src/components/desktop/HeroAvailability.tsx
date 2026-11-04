"use client";

import { useCallback, useEffect, useRef } from "react";
import { AvailabilityCard } from "@/components/desktop/AvailabilityCard";
import { reservedLeft } from "@/components/desktop/availabilityLayout";
import { AvailabilityMap } from "@/components/shared/availability/AvailabilityMap";
import { useAvailabilityScene } from "@/hooks/useAvailabilityScene";
import { useDismissOnEscape } from "@/hooks/useDismissOnEscape";
import { MOTION } from "@/lib/availability/data/config";
import { consumeFirstVisit } from "@/lib/availability/visit";
import { DESKTOP_HERO_BLEED } from "@/lib/scroll";
import { cn } from "@/lib/utils";

/** The map behind the Hero and the availability card in its middle. */
export function HeroAvailability() {
  const { scene, state } = useAvailabilityScene(reservedLeft);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const clearSelection = useCallback(() => scene.clearSelection(), [scene]);
  useDismissOnEscape(clearSelection);

  useEffect(() => {
    const timer = window.setTimeout(
      () => scene.start({ animate: consumeFirstVisit() }),
      MOTION.startDelayMs,
    );
    return () => window.clearTimeout(timer);
  }, [scene]);

  return (
    <>
      <AvailabilityMap
        scene={scene}
        crumpleTargetRef={titleRef}
        className={cn("availability-veil absolute -z-10", DESKTOP_HERO_BLEED)}
      />
      <div className="pointer-events-none flex min-h-0 flex-1 items-center py-4">
        <AvailabilityCard scene={scene} state={state} titleRef={titleRef} />
      </div>
    </>
  );
}
