"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import type { RepoStats } from "@/types";
import { cn } from "@/lib/utils";
import { useCountUp } from "@/hooks/useCountUp";

interface RepoStatsReadoutProps {
  stats: RepoStats;
  className?: string;
}

export function RepoStatsReadout({ stats, className }: RepoStatsReadoutProps) {
  const t = useTranslations("logic");
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  const total = useCountUp(stats.total, inView);
  const publicCount = useCountUp(stats.public, inView);
  const privateCount = useCountUp(stats.private, inView);

  return (
    <span
      ref={ref}
      className={cn(
        "font-mono text-xs text-contrast/50 tracking-widest uppercase",
        className,
      )}
    >
      {t("stat_repos", { count: total })}
      {stats.private > 0 && (
        <>
          <span className="text-contrast/50">{" · "}</span>
          {t("stat_public", { count: publicCount })}
          <span className="text-contrast/50">{" · "}</span>
          {t("stat_private", { count: privateCount })}
        </>
      )}
    </span>
  );
}
