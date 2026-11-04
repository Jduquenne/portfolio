"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { localize } from "@/lib/data/cv";
import type { WorldCity } from "@/lib/availability/engine/world";
import { cn } from "@/lib/utils";

interface CityRailProps {
  cities: readonly WorldCity[];
  selectedId: string | null;
  onSelect: (cityId: string) => void;
}

/** The cities in range, in a row that the finger slides sideways. */
export function CityRail({ cities, selectedId, onSelect }: CityRailProps) {
  const locale = useLocale();
  const t = useTranslations("availability");
  const railRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!selectedId) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    railRef.current
      ?.querySelector<HTMLElement>(`[data-city="${selectedId}"]`)
      ?.scrollIntoView({ inline: "center", block: "nearest", behavior: reduced ? "auto" : "smooth" });
  }, [selectedId]);

  return (
    <ul
      ref={railRef}
      aria-label={t("cities_label")}
      className="-mx-6 flex snap-x snap-proximity gap-2 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {cities.map((city) => (
        <li key={city.id} className="shrink-0 snap-center">
          <button
            type="button"
            data-city={city.id}
            aria-pressed={selectedId === city.id}
            onClick={() => onSelect(city.id)}
            className={cn(
              "min-h-10 border px-4 font-mono text-xs transition-colors",
              selectedId === city.id
                ? "border-accent/60 bg-accent/10 text-accent"
                : "border-white/12 text-contrast/70 hover:border-accent/40 hover:text-accent",
            )}
          >
            {localize(city.source.name, locale)}
          </button>
        </li>
      ))}
    </ul>
  );
}
