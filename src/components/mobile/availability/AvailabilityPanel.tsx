"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { PANEL_HEIGHT_CLASS } from "@/components/mobile/availabilityLayout";
import { CityRail } from "@/components/mobile/availability/CityRail";
import { RouteSummary } from "@/components/shared/availability/RouteSummary";
import { ORIGIN } from "@/lib/availability/data/config";
import type { Scene } from "@/lib/availability/engine/scene";
import { localize } from "@/lib/data/cv";
import type { SceneState } from "@/lib/availability/types";
import { cn } from "@/lib/utils";

interface AvailabilityPanelProps {
  scene: Scene;
  state: SceneState;
}

/** The bottom of the section: what the map shows, and the cities to pick from. */
export function AvailabilityPanel({ scene, state }: AvailabilityPanelProps) {
  const t = useTranslations("availability");
  const locale = useLocale();

  const reachable = useMemo(
    () =>
      scene.world.cities
        .filter((city) => city.route)
        .sort((a, b) => (a.route?.durationMin ?? 0) - (b.route?.durationMin ?? 0)),
    [scene],
  );
  const selected = scene.world.cities.find((city) => city.id === state.selectedCityId);

  return (
    <div
      data-map-obstacle=""
      className={cn(
        "absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 border-t border-white/8 bg-surface/95 px-6 pt-4 pb-14 transition-opacity",
        PANEL_HEIGHT_CLASS,
        state.phase === "idle" && "invisible opacity-0",
      )}
    >
      {state.mode === "onsite" ? (
        <>
          <p className="font-mono text-sm text-contrast">
            {t("onsite_title", {
              km: scene.world.radiusKm,
              city: localize(ORIGIN.name, locale),
            })}
          </p>
          <div aria-live="polite" className="h-18">
            {selected ? (
              <RouteSummary city={selected} onClear={scene.clearSelection} touch />
            ) : (
              <p className="text-xs text-contrast/50">{t("hint")}</p>
            )}
          </div>
          <CityRail
            cities={reachable}
            selectedId={state.selectedCityId}
            onSelect={scene.toggleCity}
          />
        </>
      ) : (
        <>
          <p className="font-mono text-sm text-contrast">{t("remote_title")}</p>
          <p className="text-sm text-contrast/70">{t("remote_text")}</p>
        </>
      )}
    </div>
  );
}
