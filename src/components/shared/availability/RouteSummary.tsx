"use client";

import { useLocale, useTranslations } from "next-intl";
import { OsmCredit } from "@/components/shared/availability/OsmCredit";
import { ORIGIN } from "@/lib/availability/data/config";
import { localize } from "@/lib/data/cv";
import type { WorldCity } from "@/lib/availability/engine/world";

interface RouteSummaryProps {
  city: WorldCity;
  onClear: () => void;
}

export function RouteSummary({ city, onClear }: RouteSummaryProps) {
  const locale = useLocale();
  const t = useTranslations("availability");
  const route = city.route;
  if (!route) return null;

  return (
    <div className="grid grid-cols-[1fr_auto] items-start gap-x-2 gap-y-1">
      <p className="font-mono text-sm text-contrast">
        {t("route_title", {
          from: localize(ORIGIN.name, locale),
          to: localize(city.source.name, locale),
        })}
      </p>
      <button
        type="button"
        onClick={onClear}
        className="border border-white/8 px-2 py-1 font-mono text-xs uppercase tracking-widest text-contrast/70 transition-colors hover:border-accent/40 hover:text-accent"
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
