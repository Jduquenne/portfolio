"use client";

import { useLocale, useTranslations } from "next-intl";
import { localize } from "@/lib/data/cv";
import type { WorldCity } from "@/lib/availability/engine/world";
import { cn } from "@/lib/utils";

interface CityChipsProps {
  cities: readonly WorldCity[];
  selectedId: string | null;
  onSelect: (cityId: string) => void;
}

export function CityChips({ cities, selectedId, onSelect }: CityChipsProps) {
  const locale = useLocale();
  const t = useTranslations("availability");

  return (
    <ul aria-label={t("cities_label")} className="flex flex-wrap gap-1">
      {cities.map((city) => (
        <li key={city.id}>
          <button
            type="button"
            aria-pressed={selectedId === city.id}
            onClick={() => onSelect(city.id)}
            className={cn(
              "border px-2 py-1 font-mono text-xs transition-colors",
              selectedId === city.id
                ? "border-accent/60 bg-accent/10 text-accent"
                : "border-white/8 text-contrast/70 hover:border-accent/40 hover:text-accent",
            )}
          >
            {localize(city.source.name, locale)}
          </button>
        </li>
      ))}
    </ul>
  );
}
