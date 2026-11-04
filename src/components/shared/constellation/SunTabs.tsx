"use client";

import { useTranslations } from "next-intl";
import type { ConstellationStore } from "@/lib/constellation/store";
import type { ConstellationModel } from "@/lib/constellation/types";
import { cn } from "@/lib/utils";

interface SunTabsProps {
  model: ConstellationModel;
  store: ConstellationStore;
  active: number | null;
  /** How the tabs sit (flex on a wide stage, a grid on a phone). */
  className: string;
  /** The line under each name. Left out on a phone, where room is short. */
  hints?: boolean;
}

/** The four steps, as tabs: one focuses the camera on its sun, a second press lets go. */
export function SunTabs({ model, store, active, className, hints = true }: SunTabsProps) {
  const t = useTranslations("passions");

  return (
    <div
      role="group"
      aria-label={t("suns_label")}
      className={cn("pointer-events-auto relative border-t border-white/8 pt-2", className)}
    >
      {model.suns.map((sun) => (
        <button
          key={sun.index}
          type="button"
          aria-pressed={active === sun.index}
          onClick={() => store.selectSun(active === sun.index ? null : sun.index)}
          className="inline-flex min-h-10 flex-col justify-center border-b-2 border-transparent py-2 text-left font-mono text-xs uppercase tracking-widest text-contrast/70 transition-colors hover:text-contrast aria-pressed:border-accent aria-pressed:text-accent"
        >
          {sun.name}
          {hints && (
            <span className="block text-xs normal-case tracking-normal text-contrast/50">
              {sun.hint}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
