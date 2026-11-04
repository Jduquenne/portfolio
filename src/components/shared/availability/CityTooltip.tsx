"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { localize } from "@/lib/data/cv";
import type { World } from "@/lib/availability/engine/world";

export interface TooltipTarget {
  cityId: string;
  x: number;
  y: number;
}

interface CityTooltipProps {
  world: World;
  target: TooltipTarget | null;
}

const OFFSET_PX = 16;

export function CityTooltip({ world, target }: CityTooltipProps) {
  const locale = useLocale();
  const t = useTranslations("availability");
  const ref = useRef<HTMLDivElement>(null);
  const city = target ? world.cities.find((candidate) => candidate.id === target.cityId) : null;
  const route = city?.route;
  const active = Boolean(target && city && route);

  useEffect(() => {
    if (!active) return;
    const follow = (event: PointerEvent) => {
      const element = ref.current;
      if (!element) return;
      element.style.left = `${event.clientX + OFFSET_PX}px`;
      element.style.top = `${event.clientY + OFFSET_PX}px`;
    };
    window.addEventListener("pointermove", follow);
    return () => window.removeEventListener("pointermove", follow);
  }, [active]);

  return (
    <div
      ref={ref}
      role="presentation"
      className="pointer-events-none fixed z-20 whitespace-nowrap border border-accent/40 bg-base/90 px-2 py-1 font-mono text-xs text-contrast transition-opacity"
      style={{
        left: (target?.x ?? 0) + OFFSET_PX,
        top: (target?.y ?? 0) + OFFSET_PX,
        opacity: active ? 1 : 0,
      }}
    >
      {city && route
        ? t("tooltip", {
            city: localize(city.source.name, locale),
            km: route.distanceKm,
            minutes: route.durationMin,
          })
        : null}
    </div>
  );
}
