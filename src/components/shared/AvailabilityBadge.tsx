"use client";

import { useTranslations } from "next-intl";

/** "Available for work" with a dot that quietly pings, unless motion is reduced. */
export function AvailabilityBadge() {
  const t = useTranslations("hero");

  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
      <span aria-hidden="true" className="relative flex size-2">
        <span className="absolute inline-flex size-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
        <span className="relative inline-flex size-2 rounded-full bg-accent" />
      </span>
      {t("available")}
    </span>
  );
}
