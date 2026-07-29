"use client";

import { useTranslations } from "next-intl";
import type { RepoStats } from "@/types";
import { cn } from "@/lib/utils";

interface RepoStatsReadoutProps {
  stats: RepoStats;
  className?: string;
}

export function RepoStatsReadout({ stats, className }: RepoStatsReadoutProps) {
  const t = useTranslations("logic");

  return (
    <span
      className={cn(
        "font-mono text-xs text-contrast/32 tracking-widest uppercase",
        className,
      )}
    >
      {t("stat_repos", { count: stats.total })}
      {stats.private > 0 && (
        <>
          <span className="text-contrast/16">{" · "}</span>
          {t("stat_public", { count: stats.public })}
          <span className="text-contrast/16">{" · "}</span>
          {t("stat_private", { count: stats.private })}
        </>
      )}
    </span>
  );
}
