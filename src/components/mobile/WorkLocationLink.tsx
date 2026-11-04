"use client";

import { ArrowDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ORIGIN, RADIUS_KM } from "@/lib/availability/data/config";
import { localize } from "@/lib/data/cv";
import { scrollToSection } from "@/lib/scroll";

/** A way into the work location section, from the first screen. */
export function WorkLocationLink() {
  const t = useTranslations("availability");
  const locale = useLocale();

  return (
    <button
      type="button"
      onClick={() => scrollToSection("availability")}
      className="group flex min-h-12 w-full items-center justify-between gap-4 border border-white/8 px-4 py-2 text-left font-mono text-xs transition-colors hover:border-accent/40 [@media(min-height:900px)]:min-h-14"
    >
      <span className="flex flex-col gap-1">
        <span className="uppercase tracking-widest text-contrast/70 transition-colors group-hover:text-accent">
          {t("link_title")}
        </span>
        <span className="text-contrast/50">
          {t("link_summary", { km: RADIUS_KM, city: localize(ORIGIN.name, locale) })}
        </span>
      </span>
      <ArrowDown
        size={16}
        className="shrink-0 text-contrast/50 transition-colors group-hover:text-accent"
      />
    </button>
  );
}
