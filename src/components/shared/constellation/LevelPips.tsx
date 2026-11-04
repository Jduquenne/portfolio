import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { Level } from "@/lib/constellation/types";

const STEPS = [1, 2, 3, 4, 5] as const;

interface LevelPipsProps {
  level: Level;
  className?: string;
}

/** Five diamonds, filled up to the level; the level is also said in words for screen readers. */
export function LevelPips({ level, className }: LevelPipsProps) {
  const t = useTranslations("passions");

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span aria-hidden="true" className="inline-flex gap-2">
        {STEPS.map((step) => (
          <span
            key={step}
            className={cn(
              "size-2 rotate-45 border border-accent",
              step <= level && "bg-accent",
            )}
          />
        ))}
      </span>
      <span className="sr-only">{t("level_scale", { level })}</span>
    </span>
  );
}
