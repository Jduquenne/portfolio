"use client";

import { useMemo, type RefObject } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CARD_WIDTH_CLASSES } from "@/components/desktop/availabilityLayout";
import { CityChips } from "@/components/shared/availability/CityChips";
import { ModeSwitch } from "@/components/shared/availability/ModeSwitch";
import { RouteSummary } from "@/components/shared/availability/RouteSummary";
import { ORIGIN } from "@/lib/availability/data/config";
import type { Scene } from "@/lib/availability/engine/scene";
import { localize } from "@/lib/data/cv";
import type { SceneState } from "@/lib/availability/types";
import { cn } from "@/lib/utils";

interface AvailabilityCardProps {
  scene: Scene;
  state: SceneState;
  titleRef: RefObject<HTMLHeadingElement | null>;
}

export function AvailabilityCard({ scene, state, titleRef }: AvailabilityCardProps) {
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
    <section
      aria-label={t("title")}
      data-map-obstacle=""
      className={cn(
        "pointer-events-auto flex max-h-full flex-col gap-2 overflow-auto border border-white/8 bg-surface/90 p-4 transition-opacity",
        CARD_WIDTH_CLASSES,
        state.phase === "idle" && "invisible opacity-0",
      )}
    >
      <h2
        ref={titleRef}
        className="font-mono text-xs uppercase tracking-widest text-accent"
      >
        {t("title")}
      </h2>
      <ModeSwitch mode={state.mode} onChange={scene.setMode} />

      {state.mode === "onsite" ? (
        <>
          <p className="font-mono text-sm text-contrast">
            {t("onsite_title", {
              km: scene.world.radiusKm,
              city: localize(ORIGIN.name, locale),
            })}
          </p>
          <div aria-live="polite">
            {selected ? (
              <RouteSummary city={selected} onClear={scene.clearSelection} />
            ) : (
              <p className="text-xs text-contrast/50">{t("hint")}</p>
            )}
          </div>
          <CityChips
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
    </section>
  );
}
