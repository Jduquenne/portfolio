"use client";

import { useLocale, useTranslations } from "next-intl";
import { OsmCredit } from "@/components/shared/availability/OsmCredit";
import { ORIGIN } from "@/lib/availability/data/config";
import { localize } from "@/lib/data/cv";
import type { WorldCity } from "@/lib/availability/engine/world";
import { cn } from "@/lib/utils";

interface RouteSummaryProps {
  city: WorldCity;
  onClear: () => void;
  /** A clear button tall enough for a finger. */
  touch?: boolean;
}

export function RouteSummary({ city, onClear, touch = false }: RouteSummaryProps) {
  const locale = useLocale();
  const t = useTranslations("availability");
  const route = city.route;
  if (!route) return null;

  return (
    <div className={cn("grid grid-cols-[1fr_auto] items-center gap-x-2", !touch && "gap-y-1")}>
      <p className="font-mono text-sm text-contrast">
        {t("route_title", {
          from: localize(ORIGIN.name, locale),
          to: localize(city.source.name, locale),
        })}
      </p>
      <button
        type="button"
        onClick={onClear}
        className={cn(
          "border border-white/8 font-mono text-xs uppercase tracking-widest text-contrast/70 transition-colors hover:border-accent/40 hover:text-accent",
          touch ? "min-h-10 px-4" : "px-2 py-1",
        )}
      >
        {t("route_clear")}
      </button>
      <p className="col-span-2 text-xs text-contrast/70">
        {t("route_info", { minutes: route.durationMin, km: route.distanceKm })}
      </p>
      <OsmCredit className="col-span-2 text-xs text-contrast/50" />
    </div>
  );
}
