"use client";

import { MotionConfig } from "framer-motion";
import { useDevice } from "@/hooks/useDevice";
import { DesktopLayout } from "@/components/desktop/DesktopLayout";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { AdventureSkeleton } from "@/components/shared/AdventureSkeleton";
import type { GitHubRepo, RepoStats } from "@/types";

interface AdventureRouterProps {
  repos: GitHubRepo[];
  stats: RepoStats | null;
}

export function AdventureRouter({ repos, stats }: AdventureRouterProps) {
  const { isDesktop } = useDevice();

  if (isDesktop === null) return <AdventureSkeleton />;

  return (
    <MotionConfig reducedMotion="user">
      {isDesktop ? (
        <DesktopLayout repos={repos} stats={stats} />
      ) : (
        <MobileLayout repos={repos} stats={stats} />
      )}
    </MotionConfig>
  );
}
