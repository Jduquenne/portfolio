"use client";

import { useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { AvailabilityPanel } from "@/components/mobile/availability/AvailabilityPanel";
import {
  HEAD_HEIGHT_CLASS,
  MOBILE_SCENE,
  TAP_REACH_PX,
} from "@/components/mobile/availabilityLayout";
import { AvailabilityMap } from "@/components/shared/availability/AvailabilityMap";
import { ModeSwitch } from "@/components/shared/availability/ModeSwitch";
import { useAvailabilityScene } from "@/hooks/useAvailabilityScene";
import { useStartWhenVisible } from "@/hooks/useStartWhenVisible";
import { consumeFirstVisit } from "@/lib/availability/visit";
import { cn } from "@/lib/utils";

/**
 * Where and how he can work. The map draws itself the first time the section
 * is on screen, not when the page loads.
 */
export function AvailabilitySection() {
  const t = useTranslations("availability");
  const { scene, state } = useAvailabilityScene(MOBILE_SCENE);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const start = useCallback(
    () => scene.start({ animate: consumeFirstVisit() }),
    [scene],
  );
  useStartWhenVisible(sectionRef, start);

  return (
    <section
      id="availability"
      ref={sectionRef}
      aria-label={t("title")}
      className="relative isolate h-screen shrink-0 snap-start overflow-hidden"
    >
      <AvailabilityMap
        scene={scene}
        crumpleTargetRef={titleRef}
        tapReachPx={TAP_REACH_PX}
        className="absolute inset-0 z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-5 h-36 bg-linear-to-b from-base from-35% to-transparent"
      />
      <header
        data-map-obstacle=""
        className={cn(
          "absolute inset-x-0 top-0 z-10 flex flex-col gap-4 px-6 pt-12 transition-opacity",
          HEAD_HEIGHT_CLASS,
          state.phase === "idle" && "invisible opacity-0",
        )}
      >
        <h2
          ref={titleRef}
          className="font-mono text-xs uppercase tracking-widest text-accent"
        >
          {t("title")}
        </h2>
        <ModeSwitch mode={state.mode} onChange={scene.setMode} touch />
      </header>
      <AvailabilityPanel scene={scene} state={state} />
    </section>
  );
}
