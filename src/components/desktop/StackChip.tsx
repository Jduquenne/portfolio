"use client";

import { useStackFocus } from "@/components/desktop/StackFocus";
import { stackUsage } from "@/lib/stack";
import { cn } from "@/lib/utils";

const CHIP = "border px-2 py-1 font-mono text-xs transition-colors";

interface StackChipProps {
  tech: string;
}

/** A technology of the stack. Only one an experience lists is interactive: the rest has nothing to show. */
export function StackChip({ tech }: StackChipProps) {
  const { active, pinned, hover, togglePin } = useStackFocus();

  if (!stackUsage(tech)) {
    return (
      <span className={cn(CHIP, "border-white/8 text-contrast/50")}>{tech}</span>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={pinned === tech}
      onPointerEnter={() => hover(tech)}
      onPointerLeave={() => hover(null)}
      onFocus={() => hover(tech)}
      onBlur={() => hover(null)}
      onClick={() => togglePin(tech)}
      className={cn(
        CHIP,
        active === tech
          ? "border-accent/60 bg-accent/10 text-accent"
          : "border-white/8 text-contrast/70 hover:border-accent/30",
      )}
    >
      {tech}
    </button>
  );
}
