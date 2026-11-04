"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { MapMode } from "@/lib/availability/types";

const MODES: readonly MapMode[] = ["onsite", "remote"];

interface ModeSwitchProps {
  mode: MapMode;
  onChange: (mode: MapMode) => void;
}

export function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
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
            "flex-1 whitespace-nowrap px-1 py-1 font-mono text-xs transition-colors",
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
