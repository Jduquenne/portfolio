"use client";

import { ArrowDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { cv } from "@/lib/data/cv";
import { scrollToSection } from "@/lib/scroll";

const SECTIONS = [
  { id: "experience", key: "experience" },
  { id: "logic", key: "projects" },
  { id: "passions", key: "passions" },
] as const;

interface HeroSectionNavProps {
  repoCount: number;
}

export function HeroSectionNav({ repoCount }: HeroSectionNavProps) {
  const t = useTranslations("hero");

  const startYears = cv.experiences
    .map((exp) => parseInt(exp.period, 10))
    .filter((year) => Number.isFinite(year));

  const info = {
    experience:
      startYears.length > 0
        ? t("info_experience", {
            count: cv.experiences.length,
            year: Math.min(...startYears),
          })
        : null,
    projects: repoCount > 0 ? t("info_projects", { count: repoCount }) : null,
    passions: t("info_passions", { count: cv.passions.length }),
  };

  return (
    <nav aria-label={t("nav_label")} className="grid grid-cols-3 gap-4">
      {SECTIONS.map(({ id, key }) => (
        <button
          key={id}
          type="button"
          onClick={() => scrollToSection(id)}
          data-map-obstacle=""
          className="group flex items-start justify-between gap-2 border border-white/8 px-4 py-2 text-left font-mono text-xs transition-colors hover:border-accent/40"
        >
          <span className="flex flex-col gap-1">
            <span className="uppercase tracking-widest text-contrast/70 transition-colors group-hover:text-accent">
              {t(`nav_${key}`)}
            </span>
            {info[key] && <span className="text-contrast/50">{info[key]}</span>}
          </span>
          <ArrowDown
            size={16}
            className="mt-px shrink-0 text-contrast/50 transition-[transform,color] group-hover:translate-y-1 group-hover:text-accent"
          />
        </button>
      ))}
    </nav>
  );
}
