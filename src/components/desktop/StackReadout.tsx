"use client";

import { useTranslations } from "next-intl";
import { useStackFocus } from "@/components/desktop/StackFocus";
import { stackUsage } from "@/lib/stack";

/** Says what the active technology is worth: how many experiences, since when. Two lines reserved, so nothing jumps. */
export function StackReadout() {
  const t = useTranslations("stack");
  const { active } = useStackFocus();
  const usage = active ? stackUsage(active) : null;

  return (
    <p
      aria-live="polite"
      className="min-h-8 font-mono text-xs leading-4 text-contrast/50"
    >
      {active && usage ? (
        <>
          <span className="font-bold text-accent">{active}</span>
          {" · "}
          <span className="text-contrast/70">
            {t("used", { count: usage.roles, year: usage.since })}
          </span>
        </>
      ) : (
        t("hint")
      )}
    </p>
  );
}
