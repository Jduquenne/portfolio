"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { MapMode } from "@/lib/availability/types";

const MODES: readonly MapMode[] = ["onsite", "remote"];

interface ModeSwitchProps {
  mode: MapMode;
  onChange: (mode: MapMode) => void;
  /** Buttons tall enough for a finger. */
  touch?: boolean;
}

export function ModeSwitch({ mode, onChange, touch = false }: ModeSwitchProps) {
  const t = useTranslations("availability");

  return (
    <div role="group" aria-label={t("mode_label")} className="flex border border-white/8">
      {MODES.map((candidate) => (
        <button
          key={candidate}
          type="button"
          aria-pressed={mode === candidate}
          onClick={() => onChange(candidate)}
          className={cn(
            "flex-1 whitespace-nowrap px-1 font-mono text-xs transition-colors",
            touch ? "min-h-10" : "py-1",
            mode === candidate
              ? "bg-accent/10 text-accent"
              : "text-contrast/50 hover:text-accent",
          )}
        >
          {t(`mode_${candidate}`)}
        </button>
      ))}
    </div>
  );
}
