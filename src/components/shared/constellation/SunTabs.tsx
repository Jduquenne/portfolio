"use client";

import { useTranslations } from "next-intl";
import type { ConstellationStore } from "@/lib/constellation/store";
import type { ConstellationModel } from "@/lib/constellation/types";
import { cn } from "@/lib/utils";

interface SunTabsProps {
  model: ConstellationModel;
  store: ConstellationStore;
  active: number | null;
  className?: string;
}

/** The four steps, as tabs: one focuses the camera on its sun, a second press lets go. */
export function SunTabs({ model, store, active, className }: SunTabsProps) {
  const t = useTranslations("passions");

  return (
    <div
      role="group"
      aria-label={t("suns_label")}
      className={cn("pointer-events-auto relative flex flex-wrap gap-x-8 gap-y-2 border-t border-white/8 pt-2", className)}
    >
      {model.suns.map((sun) => (
        <button
          key={sun.index}
          type="button"
          aria-pressed={active === sun.index}
          onClick={() => store.selectSun(active === sun.index ? null : sun.index)}
          className="border-b-2 border-transparent py-2 text-left font-mono text-xs uppercase tracking-widest text-contrast/70 transition-colors hover:text-contrast aria-pressed:border-accent aria-pressed:text-accent"
        >
          {sun.name}
          <span className="block text-xs normal-case tracking-normal text-contrast/50">
            {sun.hint}
          </span>
        </button>
      ))}
    </div>
  );
}
